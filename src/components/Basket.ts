import { Basket as IBasket } from "../types";
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

    getCount() {
        return this.itemIds.size;
    }

    // Методы для доступа к данным без прямого доступа к itemIds
    getItemIds(): Set<string> {
        return new Set(this.itemIds);
    }

    getItems(): string[] {
        return Array.from(this.itemIds);
    }
}
