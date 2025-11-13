import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import oracledb from "oracledb";
import { createSession, setSessionCookie } from "@/lib/auth";
import { SessionUser } from "@/types";

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = await request.json();
    
    // Log received data for debugging
    console.log("=== Signup Request Data ===");
    console.log(JSON.stringify(body, null, 2));
    console.log("===========================");
    
    const {
      // Main Information
      companyName,
      companyNameEN,
      companyType,
      companyCategory,
      nationalId,
      establishmentDate,
      economicCode,
      registrationNumber,
      registrationPlace,
      insuranceBranch,

      // CEO Information
      ceoFirstName,
      ceoLastName,
      ceoNationalId,
      ceoMobile,

      // Contact Information
      phone,
      mobile,
      fax,
      website,
      email,
      province,
      city,
      postalCode,

      // Banking Information
      bankName,
      bankBranch,
      accountNumber,
      shabaNumber,

      // Representative Information
      repFirstName,
      repLastName,
      repPhone,
      repEmail,

      // Password
      password,

      // Uploaded File IDs
      uploadedFileIds,
    } = body;

    // Validation
    if (!companyName || !nationalId || !repPhone || !password) {
      return NextResponse.json(
        { error: "لطفا تمام فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    // Validate mobile format
    if (!/^09\d{9}$/.test(repPhone)) {
      return NextResponse.json(
        { error: "فرمت شماره موبایل صحیح نیست" },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Check if contractor already exists
    const existingContractor = await connection.execute(
      `SELECT COUNT(*) as count FROM CONTRACTORS WHERE NATIONAL_ID = :nationalId OR MOBILE = :mobile`,
      { nationalId, mobile: repPhone }
    );

    const count = (existingContractor.rows?.[0] as any)?.COUNT || 0;
    if (count > 0) {
      return NextResponse.json(
        { error: "این شرکت قبلاً ثبت نام کرده است" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const ceoFullName = `${ceoFirstName || ''} ${ceoLastName || ''}`.trim();
    const repFullName = `${repFirstName || ''} ${repLastName || ''}`.trim();

    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value: any) => {
      if (value === undefined || value === null || value === '') {
        return null;
      }
      return value;
    };

    // Helper function to safely parse integers
    const parseIntOrNull = (value: any) => {
      if (!value || value === '') {
        return null;
      }
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Prepare establishment date - handle null/empty values
    let establishmentDateValue = null;
    if (establishmentDate && establishmentDate.trim() !== '') {
      establishmentDateValue = establishmentDate;
    }

    // Prepare bind parameters
    const bindParams = {
      companyName: toNullIfEmpty(companyName),
      companyNameEN: toNullIfEmpty(companyNameEN) || { val: null, type: oracledb.STRING },
      companyType: parseIntOrNull(companyType) || { val: null, type: oracledb.NUMBER },
      companyCategory: parseIntOrNull(companyCategory) || { val: null, type: oracledb.NUMBER },
      nationalId: toNullIfEmpty(nationalId),
      ...(establishmentDateValue && { establishmentDate: establishmentDateValue }),
      economicCode: toNullIfEmpty(economicCode) || { val: null, type: oracledb.STRING },
      registrationNumber: toNullIfEmpty(registrationNumber) || { val: null, type: oracledb.STRING },
      registrationDate: toNullIfEmpty(registrationPlace) || { val: null, type: oracledb.STRING },
      insuranceBranch: toNullIfEmpty(insuranceBranch) || { val: null, type: oracledb.STRING },
      ceoName: toNullIfEmpty(ceoFullName) || { val: null, type: oracledb.STRING },
      phone: toNullIfEmpty(phone) || { val: null, type: oracledb.STRING },
      mobile: toNullIfEmpty(repPhone),
      fax: toNullIfEmpty(fax) || { val: null, type: oracledb.STRING },
      website: toNullIfEmpty(website) || { val: null, type: oracledb.STRING },
      email: toNullIfEmpty(repEmail) || { val: null, type: oracledb.STRING },
      province: parseIntOrNull(province) || { val: null, type: oracledb.NUMBER },
      city: parseIntOrNull(city) || { val: null, type: oracledb.NUMBER },
      postalCode: toNullIfEmpty(postalCode) || { val: null, type: oracledb.STRING },
      bankId: parseIntOrNull(bankName) || { val: null, type: oracledb.NUMBER },
      branchAccount: toNullIfEmpty(bankBranch) || { val: null, type: oracledb.STRING },
      bankAccount: toNullIfEmpty(accountNumber) || { val: null, type: oracledb.STRING },
      shabaNumber: toNullIfEmpty(shabaNumber) || { val: null, type: oracledb.STRING },
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
    };

    console.log("=== Bind Parameters ===");
    console.log(JSON.stringify(bindParams, null, 2));
    console.log("=======================");

    // Insert contractor - using actual CONTRACTORS table schema
    const contractorResult = await connection.execute(
      `INSERT INTO CONTRACTORS (
        COMPANY_NAME,
        NAME_EN,
        CONTRACTOR_TYPE_ID,
        CONTRACTOR_CATEGORY_ID,
        NATIONAL_ID,
        ${establishmentDateValue ? 'ESTABLISHMENT_DATE,' : ''}
        ECONOMIC_CODE,
        REGISTRATION_NUMBER,
        REGISTRATION_DATE,
        INSURANCE_BRANCH,
        CEO_NAME,
        PHONE,
        MOBILE,
        FAX,
        WEBSITE,
        EMAIL,
        PROVINCE_ID,
        CITY_ID,
        POSTAL_CODE,
        BANK_ID,
        BRANCH_ACCOUNT,
        BANK_ACCOUNT,
        SHABA_NUMBER,
        STATUS,
        CREATED_DATE
      ) VALUES (
        :companyName,
        :companyNameEN,
        :companyType,
        :companyCategory,
        :nationalId,
        ${establishmentDateValue ? "TO_DATE(:establishmentDate, 'YYYY-MM-DD')," : ''}
        :economicCode,
        :registrationNumber,
        :registrationDate,
        :insuranceBranch,
        :ceoName,
        :phone,
        :mobile,
        :fax,
        :website,
        :email,
        :province,
        :city,
        :postalCode,
        :bankId,
        :branchAccount,
        :bankAccount,
        :shabaNumber,
        1, -- STATUS: 1 = "در انتظار تایید" (Pending Approval) - New contractors await admin approval
        SYSDATE
      ) RETURNING ID INTO :id`,
      bindParams
    );

    console.log("=== Contractor Insert Successful ===");
    console.log("Contractor ID:", (contractorResult.outBinds as any)?.id?.[0]);
    console.log("====================================");

    const contractorId = (contractorResult.outBinds as any)?.id?.[0];

    if (!contractorId) {
      throw new Error("Failed to get contractor ID");
    }

    // Create contractor member record for the representative
    await connection.execute(
      `INSERT INTO CONTRACTOR_MEMBERS (
        CONTRACTOR_ID,
        FIRST_NAME,
        LAST_NAME,
        NATIONAL_ID,
        MOBILE,
        EMAIL,
        POSITION_TITLE,
        IS_ACTIVE,
        CREATED_DATE
      ) VALUES (
        :contractorId,
        :firstName,
        :lastName,
        :nationalId,
        :mobile,
        :email,
        :positionTitle,
        1,
        SYSDATE
      )`,
      {
        contractorId,
        firstName: toNullIfEmpty(repFirstName) || 'نام',
        lastName: toNullIfEmpty(repLastName) || 'نام خانوادگی',
        nationalId: null, // Representative national ID not collected in form
        mobile: toNullIfEmpty(repPhone),
        email: toNullIfEmpty(repEmail),
        positionTitle: 'نماینده شرکت',
      }
    );

    // Create contractor member record for the CEO
    await connection.execute(
      `INSERT INTO CONTRACTOR_MEMBERS (
        CONTRACTOR_ID,
        FIRST_NAME,
        LAST_NAME,
        NATIONAL_ID,
        MOBILE,
        POSITION_TITLE,
        IS_ACTIVE,
        CREATED_DATE
      ) VALUES (
        :contractorId,
        :firstName,
        :lastName,
        :nationalId,
        :mobile,
        :positionTitle,
        1,
        SYSDATE
      )`,
      {
        contractorId,
        firstName: toNullIfEmpty(ceoFirstName) || 'نام',
        lastName: toNullIfEmpty(ceoLastName) || 'نام خانوادگی',
        nationalId: toNullIfEmpty(ceoNationalId),
        mobile: toNullIfEmpty(ceoMobile),
        positionTitle: 'مدیرعامل',
      }
    );

    // Create contractor login
    await connection.execute(
      `INSERT INTO CONTRACTOR_LOGIN (
        CONTRACTOR_ID,
        USERNAME,
        PASSWORD_HASH,
        FIRST_NAME,
        LAST_NAME,
        CREATED_DATE
      ) VALUES (
        :contractorId,
        :username,
        :passwordHash,
        :firstName,
        :lastName,
        SYSDATE
      )`,
      {
        contractorId,
        username: repPhone, // Use mobile as username
        passwordHash,
        firstName: toNullIfEmpty(repFirstName) || 'نام',
        lastName: toNullIfEmpty(repLastName) || 'نام خانوادگی',
      }
    );

    // Link uploaded documents if any
    if (uploadedFileIds && Object.keys(uploadedFileIds).length > 0) {
      for (const [documentType, fileId] of Object.entries(uploadedFileIds)) {
        if (fileId) {
          await connection.execute(
            `INSERT INTO CONTRACTOR_DOCUMENTS (
              CONTRACTOR_ID,
              FILE_ID,
              DOCUMENT_TYPE,
              UPLOAD_DATE
            ) VALUES (
              :contractorId,
              :fileId,
              :documentType,
              SYSDATE
            )`,
            {
              contractorId,
              fileId,
              documentType,
            }
          );
        }
      }
    }

    await connection.commit();

    // Create session user object
    const sessionUser: SessionUser = {
      id: contractorId,
      contractorId: contractorId,
      username: repPhone,
      firstName: toNullIfEmpty(repFirstName) || 'نام',
      lastName: toNullIfEmpty(repLastName) || 'نام خانوادگی',
      companyName: toNullIfEmpty(companyName) || 'شرکت',
      companyStatus: 1, // 1 = "در انتظار تایید" (Pending Approval)
    };

    // Create session and set cookie
    const token = await createSession(sessionUser);
    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "ثبت نام با موفقیت انجام شد",
        contractorId,
        user: sessionUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    return NextResponse.json(
      { error: "خطا در ثبت نام" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
