import { Basket as IBasket, ServerItem } from "../types";
import { IEvents } from "./base/events";

export class Basket implements IBasket {
    public itemIds: Set<string>;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.itemIds = new Set();
        this.events = events;
    }
    
    addItem(itemId: string) {
        if (this.alreadyInBasket(itemId)) {
            console.log("Одна штука в руки!");
            return;
        }
        this.itemIds.add(itemId);
        this.events.emit('basket:changed');
    }

    removeItem(itemId: string) {
        if (!this.alreadyInBasket(itemId)) {
            console.log("Нельзя удалить то, чего нет!");
            return;
        }
        this.itemIds.delete(itemId);
        this.events.emit('basket:changed');
    }

    alreadyInBasket(itemId: string) {
        return this.itemIds.has(itemId);        
    }

    clear() {
        this.itemIds.clear();
        this.events.emit('basket:changed');
    }

    getTotal(items: ServerItem[]) {
        return items
            .filter(item => this.itemIds.has(item.id))
            .reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount() {
        return this.itemIds.size;
    }
}
