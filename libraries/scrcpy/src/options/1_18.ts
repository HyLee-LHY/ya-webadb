import type { StructInit } from "@yume-chan/struct";
import { struct, u8 } from "@yume-chan/struct";

import type {
    AndroidKeyEventAction,
    ScrcpyBackOrScreenOnControlMessage,
} from "../control/index.js";
import { ScrcpyControlMessageType } from "../control/index.js";

import {
    SCRCPY_CONTROL_MESSAGE_TYPES_1_16,
    ScrcpyBackOrScreenOnControlMessage1_16,
    ScrcpyOptions1_16,
} from "./1_16/index.js";
import type { ScrcpyOptionsInit1_17 } from "./1_17.js";
import { ScrcpyOptions1_17 } from "./1_17.js";
import type { ScrcpyEncoder } from "./types.js";
import { ScrcpyOptions } from "./types.js";

export type ScrcpyLogLevel1_18 =
    | "verbose"
    | "debug"
    | "info"
    | "warn"
    | "error";

export const ScrcpyVideoOrientation1_18 = {
    Initial: -2,
    Unlocked: -1,
    Portrait: 0,
    Landscape: 1,
    PortraitFlipped: 2,
    LandscapeFlipped: 3,
};

export type ScrcpyVideoOrientation1_18 =
    (typeof ScrcpyVideoOrientation1_18)[keyof typeof ScrcpyVideoOrientation1_18];

export interface ScrcpyOptionsInit1_18
    extends Omit<ScrcpyOptionsInit1_17, "logLevel" | "lockVideoOrientation"> {
    logLevel?: ScrcpyLogLevel1_18;

    lockVideoOrientation?: ScrcpyVideoOrientation1_18;

    powerOffOnClose?: boolean;
}

export const ScrcpyBackOrScreenOnControlMessage1_18 = struct(
    /* #__PURE__ */ (() => ({
        ...ScrcpyBackOrScreenOnControlMessage1_16.fields,
        action: u8<AndroidKeyEventAction>(),
    }))(),
    { littleEndian: false },
);

export type ScrcpyBackOrScreenOnControlMessage1_18 = StructInit<
    typeof ScrcpyBackOrScreenOnControlMessage1_18
>;

export const SCRCPY_CONTROL_MESSAGE_TYPES_1_18 = /* #__PURE__ */ (() => {
    const result = SCRCPY_CONTROL_MESSAGE_TYPES_1_16.slice();
    result.splice(6, 0, ScrcpyControlMessageType.ExpandSettingPanel);
    return result;
})();

export class ScrcpyOptions1_18 extends ScrcpyOptions<ScrcpyOptionsInit1_18> {
    static readonly DEFAULTS = {
        ...ScrcpyOptions1_17.DEFAULTS,
        logLevel: "debug",
        lockVideoOrientation: ScrcpyVideoOrientation1_18.Unlocked,
        powerOffOnClose: false,
    } as const satisfies Required<ScrcpyOptionsInit1_18>;

    static readonly SERIALIZE_ORDER = [
        ...ScrcpyOptions1_17.SERIALIZE_ORDER,
        "powerOffOnClose",
    ] as const satisfies readonly (keyof ScrcpyOptionsInit1_18)[];

    override get defaults(): Required<ScrcpyOptionsInit1_18> {
        return ScrcpyOptions1_18.DEFAULTS;
    }

    override get controlMessageTypes() {
        return SCRCPY_CONTROL_MESSAGE_TYPES_1_18;
    }

    constructor(init: ScrcpyOptionsInit1_18) {
        super(ScrcpyOptions1_17, init, ScrcpyOptions1_18.DEFAULTS);
    }

    override serialize(): string[] {
        return ScrcpyOptions1_16.serialize(
            this.value,
            ScrcpyOptions1_18.SERIALIZE_ORDER,
        );
    }

    override parseEncoder(line: string): ScrcpyEncoder | undefined {
        return ScrcpyOptions1_17.parseEncoder(
            line,
            /^\s+scrcpy --encoder '([^']+)'$/,
        );
    }

    override serializeBackOrScreenOnControlMessage(
        message: ScrcpyBackOrScreenOnControlMessage,
    ) {
        return ScrcpyBackOrScreenOnControlMessage1_18.serialize(message);
    }
}
