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
import { toast } from "sonner"

export interface Ranking {
    id?: number
    RANKING_TYPE: string
    RANKING_LEVEL: string
    NOTES: string
}

interface RankingsSectionProps {
    icon: LucideIcon
    data: Ranking[]
    onChange: (data: Ranking[]) => void
}

export function RankingsSection({ icon: Icon, data, onChange }: RankingsSectionProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [formData, setFormData] = useState<Partial<Ranking>>({})

    const handleAdd = () => {
        setIsAdding(true)
        setFormData({
            RANKING_TYPE: '',
            RANKING_LEVEL: '',
            NOTES: '',
        })
    }

    const handleEdit = (ranking: Ranking) => {
        setEditingId(ranking.id || Date.now())
        setFormData(ranking)
        setIsAdding(true)
    }

    const handleSave = () => {
        if (!formData.RANKING_TYPE || !formData.RANKING_LEVEL) {
            toast.error('لطفا فیلدهای الزامی را پر کنید')
            return
        }

        const newRanking: Ranking = {
            id: editingId as number || undefined,
            RANKING_TYPE: formData.RANKING_TYPE || '',
            RANKING_LEVEL: formData.RANKING_LEVEL || '',
            NOTES: formData.NOTES || '',
        }

        if (editingId && typeof editingId === 'number') {
            onChange(data.map(r => r.id === editingId ? newRanking : r))
            toast.success('رتبه با موفقیت ویرایش شد')
        } else {
            onChange([...data, { ...newRanking, id: Date.now() }])
            toast.success('رتبه با موفقیت اضافه شد')
        }

        handleCancel()
    }

    const handleDelete = async (ranking: Ranking) => {
        if (ranking.id && typeof ranking.id === 'number') {
            try {
                const response = await fetch(`/api/profile/delete?type=ranking&id=${ranking.id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    onChange(data.filter(r => r.id !== ranking.id))
                    toast.success('رتبه حذف شد')
                }
            } catch (error) {
                toast.error('خطا در حذف رتبه')
            }
        } else {
            onChange(data.filter(r => r !== ranking))
            toast.success('رتبه حذف شد')
        }
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({})
    }

    const handleFormChange = (field: keyof Ranking, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <AccordionItem value="rankings" className="border rounded-md bg-white p-4 mt-3 mb-5 shadow-card-small">
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#F6F6F6] rounded-full">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">رتبه‌ها و رشته‌ها</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3">
                    <div className="flex justify-between w-full mb-4">
                        <Button onClick={handleAdd} disabled={isAdding}>
                            <Plus className="w-4 h-4" />
                            افزودن رتبه
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {data.map((ranking, index) => (
                            <Card key={ranking.id || `ranking-${index}`} className="p-6 bg-white border shadow-card-small">
                                <CardContent className="p-0 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{ranking.RANKING_TYPE}</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">رتبه: </span>
                                            <span className="font-semibold">{ranking.RANKING_LEVEL || '-'}</span>
                                        </div>
                                        {ranking.NOTES && (
                                            <div className="col-span-2">
                                                <span className="text-muted-foreground">یادداشت: </span>
                                                <span className="font-semibold">{ranking.NOTES}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border"
                                            onClick={() => handleEdit(ranking)}
                                            disabled={isAdding}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="border text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(ranking)}
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
                            هنوز رتبه‌ای اضافه نشده است
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {isAdding && (
                <Card className="p-6 bg-background border shadow-[0px_25px_39.85px_0px_#00000033] mb-5">
                    <CardContent className="p-0 space-y-4">
                        <div className="flex justify-between w-full mb-4">

                            <h4 className="font-bold">
                                {editingId ? 'ویرایش رتبه' : 'افزودن رتبه جدید'}
                            </h4>
                            <Button variant="ghost" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FieldGroup>
                                <Label>عنوان <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.RANKING_TYPE || ''}
                                    onChange={(e) => handleFormChange('RANKING_TYPE', e.target.value)}
                                    placeholder="عنوان رتبه"
                                />
                            </FieldGroup>

                            <FieldGroup>
                                <Label>رتبه <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.RANKING_LEVEL || ''}
                                    onChange={(e) => handleFormChange('RANKING_LEVEL', e.target.value)}
                                    placeholder="رتبه"
                                />
                            </FieldGroup>

                            <FieldGroup className="md:col-span-2">
                                <Label>یادداشت</Label>
                                <Textarea
                                    value={formData.NOTES || ''}
                                    onChange={(e) => handleFormChange('NOTES', e.target.value)}
                                    placeholder="یادداشت"
                                    rows={3}
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
