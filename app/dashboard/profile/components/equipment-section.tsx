"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X, LucideIcon } from "lucide-react"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FieldGroup } from "@/components/ui/field"
import { toast } from "sonner"

interface Equipment {
    id?: number
    EQUIPMENT_NAME: string
    EQUIPMENT_TYPE: string
    QUANTITY: string
}

interface EquipmentSectionProps {
    icon: LucideIcon
    data: Equipment[]
    onChange: (data: Equipment[]) => void
}

export function EquipmentSection({ icon: Icon, data, onChange }: EquipmentSectionProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [formData, setFormData] = useState<Partial<Equipment>>({})

    const handleAdd = () => {
        setIsAdding(true)
        setFormData({
            EQUIPMENT_NAME: '',
            EQUIPMENT_TYPE: '',
            QUANTITY: '',
        })
    }

    const handleEdit = (equipment: Equipment) => {
        setEditingId(equipment.id || Date.now())
        setFormData(equipment)
        setIsAdding(true)
    }

    const handleSave = () => {
        if (!formData.EQUIPMENT_NAME) {
            toast.error('لطفا عنوان تجهیزات را وارد کنید')
            return
        }

        const newEquipment: Equipment = {
            id: editingId as number || undefined,
            EQUIPMENT_NAME: formData.EQUIPMENT_NAME || '',
            EQUIPMENT_TYPE: formData.EQUIPMENT_TYPE || '',
            QUANTITY: formData.QUANTITY || '',
        }

        if (editingId && typeof editingId === 'number') {
            onChange(data.map(e => e.id === editingId ? newEquipment : e))
            toast.success('تجهیزات با موفقیت ویرایش شد')
        } else {
            onChange([...data, { ...newEquipment, id: Date.now() }])
            toast.success('تجهیزات با موفقیت اضافه شد')
        }

        handleCancel()
    }

    const handleDelete = async (equipment: Equipment) => {
        if (equipment.id && typeof equipment.id === 'number') {
            try {
                const response = await fetch(`/api/profile/delete?type=equipment&id=${equipment.id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    onChange(data.filter(e => e.id !== equipment.id))
                    toast.success('تجهیزات حذف شد')
                }
            } catch (error) {
                toast.error('خطا در حذف تجهیزات')
            }
        } else {
            onChange(data.filter(e => e !== equipment))
            toast.success('تجهیزات حذف شد')
        }
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({})
    }

    const handleFormChange = (field: keyof Equipment, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <AccordionItem value="equipment" className="border rounded-md bg-white p-4 mt-3 mb-5 shadow-card-small">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">تجهیزات و ماشین آلات</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                    <div className="flex justify-between w-full mb-4">
                        <Button onClick={handleAdd} disabled={isAdding}>
                            <Plus className="w-4 h-4" />
                            افزودن تجهیزات
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {data.map((equipment, index) => (
                            <Card key={equipment.id || `equipment-${index}`} className="p-6 bg-white border shadow-card-small">
                                <CardContent className="p-0 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{equipment.EQUIPMENT_NAME}</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">نوع: </span>
                                            <span className="font-semibold">{equipment.EQUIPMENT_TYPE || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">تعداد: </span>
                                            <span className="font-semibold">{equipment.QUANTITY || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border"
                                            onClick={() => handleEdit(equipment)}
                                            disabled={isAdding}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(equipment)}
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
                            هنوز تجهیزاتی اضافه نشده است
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {isAdding && (
                <Card className="p-6 bg-background border shadow-[0px_25px_39.85px_0px_#00000033] mb-5">
                    <CardContent className="p-0 space-y-4">
                        <div className="flex justify-between w-full">
                            <h4 className="font-bold">
                                {editingId ? 'ویرایش تجهیزات' : 'افزودن تجهیزات جدید'}
                            </h4>
                            <Button variant="ghost" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldGroup>
                                <Label>عنوان</Label>
                                <Input
                                    value={formData.EQUIPMENT_NAME || ''}
                                    onChange={(e) => handleFormChange('EQUIPMENT_NAME', e.target.value)}
                                    placeholder="عنوان تجهیزات"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>نوع</Label>
                                <Input
                                    value={formData.EQUIPMENT_TYPE || ''}
                                    onChange={(e) => handleFormChange('EQUIPMENT_TYPE', e.target.value)}
                                    placeholder="نوع تجهیزات"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>تعداد</Label>
                                <Input
                                    type="number"
                                    value={formData.QUANTITY || ''}
                                    onChange={(e) => handleFormChange('QUANTITY', e.target.value)}
                                    placeholder="تعداد"
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
