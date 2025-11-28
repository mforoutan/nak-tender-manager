"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X, LucideIcon } from "lucide-react"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FieldGroup } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Member {
    id?: number
    FIRST_NAME: string
    LAST_NAME: string
    EMAIL: string
    NATIONAL_ID: string
    MOBILE: string
    WORK_EXPERIENCE_YEARS: string
    FIELD_OF_STUDY: string
    EDUCATION_LEVEL: string
    POSITION_TITLE: string
}

interface MembersSectionProps {
    icon: LucideIcon
    data: Member[]
    onChange: (data: Member[]) => void
}

export function MembersSection({ icon: Icon, data, onChange }: MembersSectionProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [formData, setFormData] = useState<Partial<Member>>({})

    const handleAdd = () => {
        setIsAdding(true)
        setFormData({
            FIRST_NAME: '',
            LAST_NAME: '',
            EMAIL: '',
            NATIONAL_ID: '',
            MOBILE: '',
            WORK_EXPERIENCE_YEARS: '',
            FIELD_OF_STUDY: '',
            EDUCATION_LEVEL: '',
            POSITION_TITLE: '',
        })
    }

    const handleEdit = (member: Member) => {
        setEditingId(member.id || Date.now())
        setFormData(member)
        setIsAdding(true)
    }

    const handleSave = () => {
        if (!formData.NATIONAL_ID || !formData.POSITION_TITLE) {
            toast.error('لطفا فیلدهای الزامی را پر کنید')
            return
        }

        const newMember: Member = {
            id: editingId as number || undefined,
            FIRST_NAME: formData.FIRST_NAME || '',
            LAST_NAME: formData.LAST_NAME || '',
            EMAIL: formData.EMAIL || '',
            NATIONAL_ID: formData.NATIONAL_ID || '',
            MOBILE: formData.MOBILE || '',
            WORK_EXPERIENCE_YEARS: formData.WORK_EXPERIENCE_YEARS || '',
            FIELD_OF_STUDY: formData.FIELD_OF_STUDY || '',
            EDUCATION_LEVEL: formData.EDUCATION_LEVEL || '',
            POSITION_TITLE: formData.POSITION_TITLE || '',
        }

        if (editingId && typeof editingId === 'number') {
            onChange(data.map(m => m.id === editingId ? newMember : m))
            toast.success('عضو با موفقیت ویرایش شد')
        } else {
            onChange([...data, { ...newMember, id: Date.now() }])
            toast.success('عضو با موفقیت اضافه شد')
        }

        handleCancel()
    }

    const handleDelete = async (member: Member) => {
        if (member.id && typeof member.id === 'number') {
            try {
                const response = await fetch(`/api/profile/delete?type=member&id=${member.id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    onChange(data.filter(m => m.id !== member.id))
                    toast.success('عضو حذف شد')
                }
            } catch (error) {
                toast.error('خطا در حذف عضو')
            }
        } else {
            onChange(data.filter(m => m !== member))
            toast.success('عضو حذف شد')
        }
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({})
    }

    const handleFormChange = (field: keyof Member, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <AccordionItem value="members" className="border rounded-md bg-white p-4 mt-3 mb-5 shadow-card-small">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">اعضا</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                    <div className="flex justify-between w-full mb-4 ">
                        <Button onClick={handleAdd} disabled={isAdding}>
                            <Plus className="w-4 h-4" />
                            افزودن به اعضا
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {data.map((member, index) => {
                            const isProtected = member.POSITION_TITLE === 'مدیرعامل' || member.POSITION_TITLE === 'نماینده شرکت'

                            return (
                                <Card key={member.id || member.NATIONAL_ID || `member-${index}`} className="p-6 bg-white border shadow-card-small">
                                    <CardContent className="p-0 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold">
                                                {member.FIRST_NAME} {member.LAST_NAME}
                                                {isProtected && (
                                                    <span className="text-xs text-muted-foreground mr-2">(غیرقابل ویرایش)</span>
                                                )}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">نقش: </span>
                                                <span className="font-semibold">{member.POSITION_TITLE || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">کد ملی: </span>
                                                <span className="font-semibold">{member.NATIONAL_ID || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">موبایل: </span>
                                                <span className="font-semibold">{member.MOBILE || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">ایمیل: </span>
                                                <span className="font-semibold">{member.EMAIL || '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">سابقه کار: </span>
                                                <span className="font-semibold">{member.WORK_EXPERIENCE_YEARS || '-'} سال</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">تحصیلات: </span>
                                                <span className="font-semibold">{member.EDUCATION_LEVEL || '-'}</span>
                                            </div>
                                        </div>

                                        {!isProtected && (
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="border"
                                                    onClick={() => handleEdit(member)}
                                                    disabled={isAdding}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="border text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(member)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {data.length === 0 && !isAdding && (
                        <div className="text-center text-muted-foreground py-8">
                            هنوز عضوی اضافه نشده است
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {isAdding && (
                <Card className="p-6 bg-background border shadow-[0px_25px_39.85px_0px_#00000033] mb-5">
                    <CardContent className="p-0 space-y-4">
                        <div className="flex justify-between w-full">
                            <h4 className="font-bold mb-4">
                                {editingId ? 'ویرایش عضو' : 'افزودن عضو جدید'}
                            </h4>
                            <Button variant="ghost" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldGroup>
                                <Label>نام</Label>
                                <Input
                                    value={formData.FIRST_NAME || ''}
                                    onChange={(e) => handleFormChange('FIRST_NAME', e.target.value)}
                                    placeholder="نام"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>نام خانوادگی</Label>
                                <Input
                                    value={formData.LAST_NAME || ''}
                                    onChange={(e) => handleFormChange('LAST_NAME', e.target.value)}
                                    placeholder="نام خانوادگی"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>ایمیل</Label>
                                <Input
                                    type="email"
                                    value={formData.EMAIL || ''}
                                    onChange={(e) => handleFormChange('EMAIL', e.target.value)}
                                    placeholder="example@email.com"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>کد ملی <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.NATIONAL_ID || ''}
                                    onChange={(e) => handleFormChange('NATIONAL_ID', e.target.value)}
                                    placeholder="کد ملی"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>موبایل</Label>
                                <Input
                                    value={formData.MOBILE || ''}
                                    onChange={(e) => handleFormChange('MOBILE', e.target.value)}
                                    placeholder="09xxxxxxxxx"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>میزان سابقه کار (سال)</Label>
                                <Input
                                    type="number"
                                    value={formData.WORK_EXPERIENCE_YEARS || ''}
                                    onChange={(e) => handleFormChange('WORK_EXPERIENCE_YEARS', e.target.value)}
                                    placeholder="سابقه کار"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>رشته تحصیلی</Label>
                                <Input
                                    value={formData.FIELD_OF_STUDY || ''}
                                    onChange={(e) => handleFormChange('FIELD_OF_STUDY', e.target.value)}
                                    placeholder="رشته تحصیلی"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>میزان تحصیلات</Label>
                                <Select
                                    value={formData.EDUCATION_LEVEL}
                                    onValueChange={(value) => handleFormChange('EDUCATION_LEVEL', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="انتخاب کنید" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="دیپلم">دیپلم</SelectItem>
                                        <SelectItem value="کاردانی">کاردانی</SelectItem>
                                        <SelectItem value="کارشناسی">کارشناسی</SelectItem>
                                        <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                                        <SelectItem value="دکتری">دکتری</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldGroup>

                            <FieldGroup className="md:col-span-2">
                                <Label>نقش <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.POSITION_TITLE || ''}
                                    onChange={(e) => handleFormChange('POSITION_TITLE', e.target.value)}
                                    placeholder="نقش در شرکت"
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
