export class Item {
    constructor(
        // TODO: add? public id?: number,
        public name: string,
        public unit_label_name: string,
        public max_units: number,
        public qty_per_unit: number,
        public active: boolean
    ) { }
}
