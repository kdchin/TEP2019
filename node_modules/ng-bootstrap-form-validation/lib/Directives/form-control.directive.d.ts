import { ControlContainer, FormControl } from "@angular/forms";
import { BootstrapVersion } from "../Enums/BootstrapVersion";
export declare function controlPath(name: string, parent: ControlContainer): string[];
export declare class FormControlDirective {
    private parent;
    private bootstrapVersion;
    formControlName: string;
    formControl: string;
    readonly validClass: boolean;
    readonly invalidClass: boolean;
    readonly path: string[];
    readonly control: FormControl;
    readonly formDirective: any;
    readonly bootstrapFour: boolean;
    constructor(parent: ControlContainer, bootstrapVersion: BootstrapVersion);
}
