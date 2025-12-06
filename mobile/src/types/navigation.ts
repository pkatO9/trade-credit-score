export type RootStackParamList = {
    Login: undefined;
    VerifyOtp: { phone: string; requestId: string };
    Home: undefined;
    Contacts: undefined;
    AddContact: undefined;
    CreateInvoice: undefined;
    InvoiceDetail: { invoiceId: string };
    PendingInvoices: undefined;
    Notifications: undefined;
};
