export class Item {
    constructor(
        public id: number,
        public name: string,
        public unit_label_name: string,
        public max_units: number,
        public qty_per_unit: number,
        public active: boolean,
        public rank: number,
    ) { }
}


export class Waiver {
    constructor(
        public id: number,
        public file: File,
        public uploaded_date: Date,
    ) { }
}


export class Teacher {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public email: string,
        public phone: string,
        public active: boolean,
        public school: School,
        public address: string,
    ) { }
}

export class OrderTeacher {
    constructor(
        public id: number,
        public checkout_time: string,
        public uploaded: boolean,
        public waiver: Waiver,
    ) { }
}

export class TeacherDetail {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public email: string,
        public phone: string,
        public active: boolean,
        public school: School,
        public orders: Array<OrderTeacher>,
        public address: string,
    ) { }
}

export class Order {
    constructor(
        public id: number,
        public checkout_time: string,
        public uploaded: boolean,
        public waiver: Waiver,
        public teacher: Teacher,
        public password_hash?: string,
    ) { }
}

export class OrderDetail {
    constructor(
        public id: number,
        public checkout_time: string,
        public uploaded: boolean,
        public waiver: Waiver,
        public teacher: Teacher,
        public order_items: Array<OrderDetailItem>,
    ) { }
}

export class OrderDetailItem {
    constructor(
        public id: number,
        public item: Item,
        public units_taken: number,
    ) { }
}

export class OrderItem {
    constructor(
        public id: number,
        public item: Item,
        public order: Order,
        public units_taken: number,
    ) { }
}

export class School {
    constructor(
        public id: number,
        public name: string,
        public active: boolean
    ) { }
}

export class ValPass {
    constructor(
        public id: number,
        public digest: string,
        public uploaded_date: Date,
    ) { }
}

export class SignedRequest {
    constructor(
        public data: any,
        public url: string,
    ) { }
}