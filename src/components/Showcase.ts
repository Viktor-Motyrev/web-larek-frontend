import { ServerItem, Showcase as IShowcase } from "../types";
import { IEvents } from "./base/events";

export class Showcase implements IShowcase {
    protected _items: ServerItem[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._items = [];
    }

    set items(items: ServerItem[]) {
        this._items = items;
        this.events.emit('showcase:changed')
    }

    get items(): ServerItem[] {
        return this._items;
    }

    getItem(itemId:string) {
         return this._items.find((item) => item.id === itemId)
    }
}
