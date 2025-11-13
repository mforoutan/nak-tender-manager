import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AccountClient from "./account-client"

export const metadata: Metadata = {
  title: "حساب کاربری | سامانه مدیریت مناقصات",
  description: "تکمیل اطلاعات حساب کاربری و ارسال مدارک جهت بررسی",
}

async function getContractorData(contractorId: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/account/profile?id=${contractorId}`, {
      cache: 'no-store',
    })
    
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error("Error fetching contractor data:", error)
    return null
  }
}

export default async function AccountPage() {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  const contractorId = session.contractorId
  const initialData = await getContractorData(contractorId)

  return <AccountClient contractorId={contractorId} initialData={initialData} />
}
