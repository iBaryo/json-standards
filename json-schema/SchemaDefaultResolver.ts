import {JSONSchema7} from "json-schema";
import {JSONPointer} from "../json-pointer/VersionParser";
import * as JsonPointer from "json-pointer";

export function forSchema(schema: JSONSchema7) {
    return {
        find(pointer: JSONPointer): JSONSchema7 {
            return JsonPointer.parse(pointer).reduce((curSch, token) => {
                switch (curSch.type) {
                    case "array":
                        if (curSch.items instanceof Array) {
                            return curSch.items[parseInt(token)] as JSONSchema7;
                        } else {
                            return curSch.items as JSONSchema7;
                        }
                    case "object":
                        return curSch.properties[token] as JSONSchema7;
                    default:
                        return curSch;
                }
            }, schema);
        }
    };
}
