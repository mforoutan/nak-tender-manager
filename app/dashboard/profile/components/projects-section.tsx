"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X, LucideIcon } from "lucide-react"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup } from "@/components/ui/field"
import { PersianDatePicker } from "@/components/ui/persian-date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export interface Project {
    id?: number
    PROJECT_TITLE: string
    CLIENT_NAME: string
    REFERENCE_PHONE: string
    COMPLETION_STATUS: string
    PROJECT_VALUE: string
    START_DATE: string
    END_DATE: string
    PROJECT_TYPE: string
    PROJECT_DESCRIPTION: string
}

interface ProjectsSectionProps {
    icon: LucideIcon
    data: Project[]
    onChange: (data: Project[]) => void
}

export function ProjectsSection({ icon: Icon, data, onChange }: ProjectsSectionProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [formData, setFormData] = useState<Partial<Project>>({})

    const handleAdd = () => {
        setIsAdding(true)
        setFormData({
            PROJECT_TITLE: '',
            CLIENT_NAME: '',
            REFERENCE_PHONE: '',
            COMPLETION_STATUS: '',
            PROJECT_VALUE: '',
            START_DATE: '',
            END_DATE: '',
            PROJECT_TYPE: '',
            PROJECT_DESCRIPTION: '',
        })
    }

    const handleEdit = (project: Project) => {
        setEditingId(project.id || Date.now())
        setFormData(project)
        setIsAdding(true)
    }

    const handleSave = () => {
        if (!formData.PROJECT_TYPE) {
            toast.error('لطفا نوع پروژه را انتخاب کنید')
            return
        }

        const newProject: Project = {
            id: editingId as number || undefined,
            PROJECT_TITLE: formData.PROJECT_TITLE || '',
            CLIENT_NAME: formData.CLIENT_NAME || '',
            REFERENCE_PHONE: formData.REFERENCE_PHONE || '',
            COMPLETION_STATUS: formData.COMPLETION_STATUS || '',
            PROJECT_VALUE: formData.PROJECT_VALUE || '',
            START_DATE: formData.START_DATE || '',
            END_DATE: formData.END_DATE || '',
            PROJECT_TYPE: formData.PROJECT_TYPE || '',
            PROJECT_DESCRIPTION: formData.PROJECT_DESCRIPTION || '',
        }

        if (editingId && typeof editingId === 'number') {
            onChange(data.map(p => p.id === editingId ? newProject : p))
            toast.success('پروژه با موفقیت ویرایش شد')
        } else {
            onChange([...data, { ...newProject, id: Date.now() }])
            toast.success('پروژه با موفقیت اضافه شد')
        }

        handleCancel()
    }

    const handleDelete = async (project: Project) => {
        if (project.id && typeof project.id === 'number') {
            try {
                const response = await fetch(`/api/profile/delete?type=project&id=${project.id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    onChange(data.filter(p => p.id !== project.id))
                    toast.success('پروژه حذف شد')
                }
            } catch (error) {
                toast.error('خطا در حذف پروژه')
            }
        } else {
            onChange(data.filter(p => p !== project))
            toast.success('پروژه حذف شد')
        }
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({})
    }

    const handleFormChange = (field: keyof Project, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <AccordionItem value="projects" className="border rounded-md bg-white p-4 mt-3 mb-5 shadow-card-small">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">پروژه‌های انجام شده</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                    <Button onClick={handleAdd} disabled={isAdding} className="mb-4">
                        <Plus className="w-4 h-4" />
                        افزودن پروژه
                    </Button>

                    <div className="space-y-4">
                        {data.map((project, index) => (
                            <Card key={project.id || `project-${index}`} className="p-6 bg-white border shadow-card-small">
                                <CardContent className="p-0 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{project.PROJECT_TITLE}</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">کارفرما: </span>
                                            <span className="font-semibold">{project.CLIENT_NAME || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">نوع: </span>
                                            <span className="font-semibold">{project.PROJECT_TYPE || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">پیشرفت: </span>
                                            <span className="font-semibold">{project.COMPLETION_STATUS || '-'}%</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">مبلغ: </span>
                                            <span className="font-semibold">{project.PROJECT_VALUE || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border"
                                            onClick={() => handleEdit(project)}
                                            disabled={isAdding}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(project)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {data.length === 0 && !isAdding && (
                        <div className="text-center text-muted-foreground py-8">
                            هنوز پروژه‌ای اضافه نشده است
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {isAdding && (
                <Card className="p-6 bg-background border shadow-[0px_25px_39.85px_0px_#00000033] mb-5">
                    <CardContent className="p-0 space-y-4">
                        <div className="flex justify-between w-full">
                            <h4 className="font-bold mb-4">
                                {editingId ? 'ویرایش پروژه' : 'افزودن پروژه جدید'}
                            </h4>
                            <Button variant="ghost" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldGroup className="md:col-span-2">
                                <Label>عنوان پروژه</Label>
                                <Input
                                    value={formData.PROJECT_TITLE || ''}
                                    onChange={(e) => handleFormChange('PROJECT_TITLE', e.target.value)}
                                    placeholder="عنوان پروژه"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>نام کارفرما</Label>
                                <Input
                                    value={formData.CLIENT_NAME || ''}
                                    onChange={(e) => handleFormChange('CLIENT_NAME', e.target.value)}
                                    placeholder="نام کارفرما"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>تلفن مرجع</Label>
                                <Input
                                    value={formData.REFERENCE_PHONE || ''}
                                    onChange={(e) => handleFormChange('REFERENCE_PHONE', e.target.value)}
                                    placeholder="تلفن"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>نوع پروژه <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.PROJECT_TYPE}
                                    onValueChange={(value) => handleFormChange('PROJECT_TYPE', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="انتخاب کنید" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="دولتی">دولتی</SelectItem>
                                        <SelectItem value="خصوصی">خصوصی</SelectItem>
                                        <SelectItem value="مشترک">مشترک</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldGroup>

                            <FieldGroup>
                                <Label>درصد پیشرفت</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.COMPLETION_STATUS || ''}
                                    onChange={(e) => handleFormChange('COMPLETION_STATUS', e.target.value)}
                                    placeholder="0-100"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>مبلغ پروژه (ریال)</Label>
                                <Input
                                    type="number"
                                    value={formData.PROJECT_VALUE || ''}
                                    onChange={(e) => handleFormChange('PROJECT_VALUE', e.target.value)}
                                    placeholder="مبلغ"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>تاریخ شروع</Label>
                                <PersianDatePicker
                                    value={formData.START_DATE || ''}
                                    onChange={(value) => handleFormChange('START_DATE', value)}
                                    placeholder="انتخاب تاریخ"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>تاریخ پایان</Label>
                                <PersianDatePicker
                                    value={formData.END_DATE || ''}
                                    onChange={(value) => handleFormChange('END_DATE', value)}
                                    placeholder="انتخاب تاریخ"
                                />
                            </FieldGroup>

                            <FieldGroup className="md:col-span-2">
                                <Label>توضیحات پروژه</Label>
                                <Textarea
                                    value={formData.PROJECT_DESCRIPTION || ''}
                                    onChange={(e) => handleFormChange('PROJECT_DESCRIPTION', e.target.value)}
                                    placeholder="توضیحات"
                                    rows={4}
                                />
                            </FieldGroup>
                        </div>

                        <div className="flex gap-2 justify-end pt-4">
                            <Button onClick={handleSave}>
                                <Check className="w-4 h-4" />
                                {editingId ? 'ذخیره تغییرات' : 'افزودن'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
