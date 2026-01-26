"use server";

import { connectToDatabase } from "@/lib/mongodb";
import CourseMaterial, {
  CourseType,
  ICourseMaterial,
} from "@/models/CourseMaterial";

export interface IGroupedMaterials {
  course: string;
  materials: ICourseMaterial[];
  courseName: string;
  teacherName: string;
  courseType: CourseType;
}

interface GetGroupedMaterialsParams {
  level?: number;
  term?: number;
  q?: string;
}

export interface IMaterialsFilters {
  levels: { value: number; label: string }[];
  terms: { value: number; label: string }[];
}

// parse level/term safely without allowed list
const parseParam = (val: string | number | undefined) => {
  if (val === undefined) return undefined;
  const n = typeof val === "string" ? Number(val) : val;
  return Number.isInteger(n) && n > 0 ? n : undefined;
};

// escape user input for regex
const escapeRegex = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export async function getGroupedMaterials(
  params?: GetGroupedMaterialsParams,
): Promise<IGroupedMaterials[]> {
  await connectToDatabase();
  const matchFilter: any = {};

  if (params?.level !== undefined) matchFilter.level = parseParam(params.level);
  if (params?.term !== undefined) matchFilter.term = parseParam(params.term);
  if (params?.q) {
    matchFilter.course = {
      $regex: escapeRegex(params.q),
      $options: "i",
    };
  }

  const result = await CourseMaterial.aggregate<IGroupedMaterials>([
    { $match: matchFilter },
    {
      $group: {
        _id: "$course",
        materials: { $push: "$$ROOT" },
      },
    },
    {
      $addFields: {
        regexCourse: {
          $regexFind: { input: "$_id", regex: "^(.*?)\\s*\\(" },
        },
        regexTeacher: {
          $regexFind: { input: "$_id", regex: "\\((.*?)\\)" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        course: "$_id",

        courseName: {
          $trim: {
            input: {
              $ifNull: [{ $arrayElemAt: ["$regexCourse.captures", 0] }, "$_id"],
            },
          },
        },

        teacherName: {
          $trim: {
            input: { $arrayElemAt: ["$regexTeacher.captures", 0] },
          },
        },

        courseType: {
          $cond: {
            if: { $regexMatch: { input: "$_id", regex: CourseType.PRACTICAL } },
            then: CourseType.PRACTICAL,
            else: CourseType.THEORETICAL,
          },
        },

        materials: {
          $map: {
            input: "$materials",
            as: "m",
            in: {
              $mergeObjects: [
                "$$m",
                {
                  _id: { $toString: "$$m._id" },
                  createdAt: { $toDate: "$$m._id" },
                },
              ],
            },
          },
        },
      },
    },
    { $sort: { courseName: 1 } },
  ]);

  return result;
}

export async function getMaterialsFilters(): Promise<IMaterialsFilters> {
  await connectToDatabase();

  const result = await CourseMaterial.aggregate<IMaterialsFilters>([
    { $sort: { level: 1, term: 1 } },
    {
      $group: {
        _id: null,
        levels: { $addToSet: "$level" },
        terms: { $addToSet: "$term" },
      },
    },
    {
      $project: {
        _id: 0,
        levels: {
          $map: {
            input: "$levels",
            as: "lvl",
            in: {
              value: "$$lvl",
              label: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$$lvl", 1] }, then: "المستوى الأول" },
                    { case: { $eq: ["$$lvl", 2] }, then: "المستوى الثاني" },
                    { case: { $eq: ["$$lvl", 3] }, then: "المستوى الثالث" },
                    { case: { $eq: ["$$lvl", 4] }, then: "المستوى الرابع" },
                  ],
                  default: {
                    $concat: ["المستوى ", { $toString: "$$lvl" }],
                  },
                },
              },
            },
          },
        },
        terms: {
          $map: {
            input: "$terms",
            as: "trm",
            in: {
              value: "$$trm",
              label: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$$trm", 1] }, then: "الفصل الأول" },
                    { case: { $eq: ["$$trm", 2] }, then: "الفصل الثاني" },
                  ],
                  default: {
                    $concat: ["الفصل ", { $toString: "$$trm" }],
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);

  return result[0];
}
