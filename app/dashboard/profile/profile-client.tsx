"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UsersRound, FolderTree, Computer, Goal, Network, Badge, Tag, Newspaper } from "lucide-react"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  MembersSection,
  ProjectsSection,
  EquipmentSection,
  RankingsSection,
  // CertificatesSection,
  // ActivitiesSection,
} from "./components/index"

interface ProfileClientProps {
  contractorId: number
}

export default function ProfileClient({ contractorId }: ProfileClientProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // State for each section
  const [members, setMembers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [equipment, setEquipment] = useState<any[]>([])
  const [rankings, setRankings] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile/data')
        const result = await response.json()

        if (result.success) {
          setMembers(result.data.members || [])
          setProjects(result.data.projects || [])
          setEquipment(result.data.equipment || [])
          setRankings(result.data.rankings || [])
          setCertificates(result.data.certificates || [])
          setActivities(result.data.activities || [])
        } else {
          toast.error('خطا در دریافت اطلاعات')
        }
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('خطا در دریافت اطلاعات')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members,
          projects,
          equipment,
          rankings,
          certificates,
          activities,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('اطلاعات با موفقیت ذخیره شد')
      } else {
        toast.error(result.error || 'خطا در ذخیره اطلاعات')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('خطا در ذخیره اطلاعات')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 lg:px-6">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">اطلاعات تکمیلی پروفایل</h1>
      </div>

      <div className="bg-[#F6F6F6] rounded-2xl p-4 md:p-8 lg:p-12">

        <div className="pt-6">
          <Accordion type="multiple" className="space-y-4">
        <MembersSection
          icon={UsersRound}
          data={members}
          onChange={setMembers}
        />

        <ProjectsSection
          icon={FolderTree}
          data={projects}
          onChange={setProjects}
        />

        <EquipmentSection
          icon={Computer}
          data={equipment}
          onChange={setEquipment}
        />

        <RankingsSection
          icon={Goal}
          data={rankings}
          onChange={setRankings}
        />

        {/* TODO: Implement remaining sections */}
        {/* 
        <CertificatesSection
          icon={Badge}
          data={certificates}
          onChange={setCertificates}
        />

        <ActivitiesSection
          icon={Tag}
          data={activities}
          onChange={setActivities}
        />
        */}
          </Accordion>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="min-w-[200px]"
          >
            {isSaving ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                در حال ذخیره...
              </>
            ) : (
              'ذخیره تغییرات'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
