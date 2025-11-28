import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProfileClient from "./profile-client"

export const metadata = {
  title: "پروفایل من | داشبورد",
  description: "صفحه پروفایل من در داشبورد کاربری",
}


export default async function ProfilePage() {
  const session = await getSession()

  if (!session?.contractorId) {
    redirect('/auth/login')
  }

  // Check if account is verified
  const isVerified = session.accountVerificationTask?.status === 'COMPLETED'

  if (!isVerified) {
    return (
      <div className="px-4 lg:px-6 space-y-6">
        <h1 className="font-medium text-xl">اطلاعات تکمیلی</h1>
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-2">تکمیل اطلاعات حساب کاربری</h3>
          <p className="text-amber-700 mb-4">
            ابتدا باید اطلاعات حساب کاربری خود را تکمیل و تایید کنید.
          </p>
          <a 
            href="/dashboard/account"
            className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            تکمیل اطلاعات
          </a>
        </div>
      </div>
    )
  }

  return <ProfileClient contractorId={session.contractorId} />
}
