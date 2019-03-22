export class Item {
    constructor(
        // TODO: add? public id?: number,
        public id: number,
        public name: string,
        public unit_label_name: string,
        public max_units: number,
        public qty_per_unit: number,
        public active: boolean
    ) { }
}

export class Teacher {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public email: string,
        public phone: string,
        public active: boolean
    ) { }
}

export class Order {
    constructor(
        public id: number,
        public shopping_date: Date,
        public uploaded: boolean,
        public waiver_signed: boolean,
        public teacher: Teacher,
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
        public name: string,
        public active: boolean
    ) { }
}
