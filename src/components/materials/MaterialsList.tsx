import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Download, GraduationCap, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IGroupedMaterials } from "@/lib/material-sctions";

export default function MaterialsList({ materials }: { materials: IGroupedMaterials[] }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {materials.map((m) => (
        <Card key={m.course} className="relative overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

          <CardHeader className="pb-4">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none py-1 px-3">
                <GraduationCap className="w-3.5 h-3.5 ml-1.5" />
                {m.courseType}
              </Badge>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>{m.materials.length} ملفات</span>
              </div>
            </div>
            <CardTitle className="text-xl text-center font-bold group-hover:text-primary transition-colors line-clamp-2">
              {m.courseName}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">مدرس المادة</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{m.teacherName || "غير محدد"}</span>
              </div>
            </div>

            {m.materials.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={m.course} className="border-none">
                  <AccordionTrigger className="hover:no-underline px-4 py-3 text-sm font-bold bg-primary/5 hover:bg-primary/10 rounded-xl transition-all text-primary border border-primary/10">
                    تصفح الملفات
                  </AccordionTrigger>
                  <AccordionContent className="pt-3 space-y-2">
                    {m.materials.map((item) => (
                      <div key={item._id.toString()} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all group/item">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 transition-colors">
                            <FileText className="w-4 h-4 text-slate-500 group-hover/item:text-primary" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate group-hover/item:text-primary transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.createdAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>

                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full shrink-0 group-hover/item:text-primary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

