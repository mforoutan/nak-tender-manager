export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';

export interface FormFieldConfig {
    name: string;
    label: string;
    placeholder?: string;
    type: FieldType;
    required?: boolean;
    disabled?: boolean;
    gridCol?: 'full' | 'half' | 'third';
    selectOptions?: Array<{ value: string; label: string }>;
    apiEndpoint?: string; // For dynamic select options
    dependsOn?: string; // For cascading selects
    validation?: {
        pattern?: RegExp;
        message?: string;
        minLength?: number;
        maxLength?: number;
    };
    rows?: number; // For textarea
}

export interface FormSectionConfig {
    id: string;
    title: string;
    icon: string;
    fields: FormFieldConfig[];
}

// Main Information Fields
export const mainInfoFields: FormFieldConfig[] = [
    {
        name: 'companyName',
        label: 'نام شرکت',
        placeholder: 'نام شرکت خود را وارد کنید',
        type: 'text',
        required: true,
        gridCol: 'half',
    },
    {
        name: 'companyNameEN',
        label: 'نام شرکت (انگلیسی)',
        placeholder: 'نام شرکت به انگلیسی',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'companyType',
        label: 'نوع شرکت',
        placeholder: 'نوع شرکت را انتخاب کنید',
        type: 'select',
        gridCol: 'half',
        apiEndpoint: '/api/contractor-types',
    },
    {
        name: 'companyCategory',
        label: 'نوع فعالیت',
        placeholder: 'نوع فعالیت را انتخاب کنید',
        type: 'select',
        gridCol: 'half',
        apiEndpoint: '/api/contractor-categories',
    },
    {
        name: 'nationalId',
        label: 'شناسه ملی',
        placeholder: 'شناسه ملی ۱۱ رقمی',
        type: 'text',
        required: true,
        gridCol: 'half',
        validation: {
            pattern: /^\d{11}$/,
            message: 'شناسه ملی باید ۱۱ رقم باشد',
            minLength: 11,
            maxLength: 11,
        },
    },
    {
        name: 'economicCode',
        label: 'کد اقتصادی',
        placeholder: 'کد اقتصادی شرکت',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'registrationNumber',
        label: 'شماره ثبت',
        placeholder: 'شماره ثبت شرکت',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'establishmentDate',
        label: 'تاریخ تأسیس',
        placeholder: 'تاریخ تأسیس را انتخاب کنید',
        type: 'date',
        gridCol: 'half',
    },
    {
        name: 'registrationPlace',
        label: 'محل ثبت',
        placeholder: 'محل ثبت شرکت',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'insuranceBranch',
        label: 'شعبه بیمه',
        placeholder: 'شعبه بیمه تأمین اجتماعی',
        type: 'text',
        gridCol: 'half',
    },
];

// CEO Information Fields
export const ceoInfoFields: FormFieldConfig[] = [
    {
        name: 'ceoFirstName',
        label: 'نام',
        placeholder: 'نام مدیرعامل',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'ceoLastName',
        label: 'نام خانوادگی',
        placeholder: 'نام خانوادگی مدیرعامل',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'ceoNationalId',
        label: 'کد ملی',
        placeholder: 'کد ملی ۱۰ رقمی',
        type: 'text',
        gridCol: 'half',
        validation: {
            pattern: /^\d{10}$/,
            message: 'کد ملی باید ۱۰ رقم باشد',
            minLength: 10,
            maxLength: 10,
        },
    },
    {
        name: 'ceoMobile',
        label: 'شماره موبایل',
        placeholder: '09xxxxxxxxx',
        type: 'tel',
        gridCol: 'half',
        validation: {
            pattern: /^09\d{9}$/,
            message: 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد',
        },
    },
];

// Contact Information Fields
export const contactInfoFields: FormFieldConfig[] = [
    {
        name: 'phone',
        label: 'تلفن ثابت',
        placeholder: 'شماره تلفن ثابت',
        type: 'tel',
        gridCol: 'third',
    },
    {
        name: 'mobile',
        label: 'موبایل',
        placeholder: '09xxxxxxxxx',
        type: 'tel',
        required: true,
        gridCol: 'third',
        validation: {
            pattern: /^09\d{9}$/,
            message: 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد',
        },
    },
    {
        name: 'fax',
        label: 'فکس',
        placeholder: 'شماره فکس',
        type: 'tel',
        gridCol: 'third',
    },
    {
        name: 'email',
        label: 'ایمیل',
        placeholder: 'example@domain.com',
        type: 'email',
        gridCol: 'half',
    },
    {
        name: 'website',
        label: 'وب‌سایت',
        placeholder: 'https://example.com',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'province',
        label: 'استان',
        placeholder: 'استان را انتخاب کنید',
        type: 'select',
        required: true,
        gridCol: 'half',
        apiEndpoint: '/api/locations/provinces',
    },
    {
        name: 'city',
        label: 'شهر',
        placeholder: 'شهر را انتخاب کنید',
        type: 'select',
        required: true,
        gridCol: 'half',
        dependsOn: 'province',
        apiEndpoint: '/api/locations/cities',
    },
    {
        name: 'postalCode',
        label: 'کد پستی',
        placeholder: 'کد پستی ۱۰ رقمی',
        type: 'text',
        required: true,
        gridCol: 'full',
        validation: {
            pattern: /^\d{10}$/,
            message: 'کد پستی باید ۱۰ رقم باشد',
            minLength: 10,
            maxLength: 10,
        },
    },
];

// Banking Information Fields
export const bankingInfoFields: FormFieldConfig[] = [
    {
        name: 'bankName',
        label: 'نام بانک',
        placeholder: 'بانک را انتخاب کنید',
        type: 'select',
        gridCol: 'half',
        apiEndpoint: '/api/banks',
    },
    {
        name: 'bankBranch',
        label: 'شعبه بانک',
        placeholder: 'نام شعبه',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'accountNumber',
        label: 'شماره حساب',
        placeholder: 'شماره حساب بانکی',
        type: 'text',
        gridCol: 'half',
    },
    {
        name: 'shabaNumber',
        label: 'شماره شبا',
        placeholder: 'IR بدون',
        type: 'text',
        required: true,
        gridCol: 'half',
        validation: {
            pattern: /^\d{24}$/,
            message: 'شماره شبا باید ۲۴ رقم باشد (بدون IR)',
            minLength: 24,
            maxLength: 24,
        },
    },
];

// Representative Information Fields
export const representativeInfoFields: FormFieldConfig[] = [
    {
        name: 'repFirstName',
        label: 'نام',
        placeholder: 'نام نماینده',
        type: 'text',
        required: true,
        gridCol: 'half',
    },
    {
        name: 'repLastName',
        label: 'نام خانوادگی',
        placeholder: 'نام خانوادگی نماینده',
        type: 'text',
        required: true,
        gridCol: 'half',
    },
    {
        name: 'repPhone',
        label: 'تلفن تماس',
        placeholder: '09xxxxxxxxx',
        type: 'tel',
        required: true,
        gridCol: 'half',
        validation: {
            pattern: /^09\d{9}$/,
            message: 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد',
        },
    },
    {
        name: 'repEmail',
        label: 'ایمیل',
        placeholder: 'example@domain.com',
        type: 'email',
        gridCol: 'half',
    },
];

// All form sections configuration
export const formSectionsConfig: FormSectionConfig[] = [
    {
        id: 'section-1',
        title: 'اطلاعات اصلی',
        icon: 'Building',
        fields: mainInfoFields,
    },
    {
        id: 'section-2',
        title: 'اطلاعات مدیرعامل',
        icon: 'User',
        fields: ceoInfoFields,
    },
    {
        id: 'section-3',
        title: 'اطلاعات تماس',
        icon: 'Phone',
        fields: contactInfoFields,
    },
    {
        id: 'section-4',
        title: 'اطلاعات بانکی',
        icon: 'CreditCard',
        fields: bankingInfoFields,
    },
    {
        id: 'section-5',
        title: 'اطلاعات نماینده',
        icon: 'UserCog',
        fields: representativeInfoFields,
    },
];
