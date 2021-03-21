/*
import { InventoryItem } from '../entities/inventory-item.entity';
import { EntityManager, QueryOrderMap, QueryOrder, wrap } from 'mikro-orm';

// ?
import { Filter } from '../models/filter.model';

export {
	getInventoryItems,
	getInventoryItem,
	updateInventoryItem,
	addInventoryItem,
	removeInventoryItem,
	countInventoryItems
};

async function countInventoryItems(
	em: EntityManager,
	activeOnly: boolean = false,
	name: string = ''
) {
	if (!(em instanceof EntityManager)) {
		return Error('invalid request');
	}

	const filter: Partial<Filter> = {};
	if (activeOnly) {
		filter.active = true;
	}
	if (name) {
		filter.name = name;
	}

	console.log('');
	console.log('inventory-item.service.ts, countInventoryItems():');
	console.log('filter:', filter);

	try {
		const count = await em.count(
			InventoryItem,
			// activeOnly ? { active: true } : {}
			filter
		);

		console.log('count:', count);
		console.log('inventory-item.service.ts, countInventoryItems()^');
		console.log('');

		return count;
	} catch (ex) {
		return ex;
	}
}

async function getInventoryItems(
	em: EntityManager,
	page: number,
	limit: number,
	sort: string,
	activeOnly: boolean,
	name: string
): Promise<Error | InventoryItem[] | Filter[]> {
	if (!(em instanceof EntityManager)) {
		return Error('invalid request');
	}

	const sorting: QueryOrderMap = {};
	if (sort) {

		const sortParams = sort.split('_');
		const column = sortParams[0];
		const order = sortParams[1];

		console.log('sortParams:', sortParams);
		console.log('column:', column);
		console.log('order:', order);

		if (column && order) {
			sorting[column] = order === 'desc' ? QueryOrder.DESC : QueryOrder.ASC;
			console.log('sorting:', sorting);
		} else {
			return Error('invalid params');
		}
	}

	console.log('page:', page);
	console.log('limit:', limit);
	console.log('sort:', sort);
	console.log('activeOnly:', activeOnly);
	console.log('name:', name);

	const options = {
		orderBy: sorting,
		limit: limit,
		offset: (page - 1) * limit,	// daca dorim pagina 1 cu 5 elemente => offset = 0, daca dormi pagina 2 => offset = 5, samd
	};

	const filter: Partial<Filter> = {};
	if (activeOnly) {
		filter.active = true;
	}
	if (name) {
		filter.name = name;
	}
	console.log('filter:', filter);

	try {

		const items = await em.find(
			InventoryItem,
			filter,
			options
		);
		await new Promise(
			(resolve) => {
				setTimeout(resolve, 500);
			}
		);

		// console.log('items:', items);

		console.log('');
		console.log('inventory-item.service.ts, getInventoryItems():');
		// console.log(items);
		// items.forEach(item => {
		// 	console.log(item.active);
		// });
		console.log('items.length:', items.length);
		console.log('inventory-item.service.ts, getInventoryItems()^');

		return items;
	} catch (ex) {
		return ex;
	}
}

async function getInventoryItem(
	em: EntityManager,
	id: string
): Promise<Error | InventoryItem | null> {
	if (!(em instanceof EntityManager)) {
		return Error('invalid request');
	}

	if (!id || typeof id !== 'string') {
		return Error('invalid params');
	}

	console.log('');
	console.log('inventory-item.service.ts, getInventoryItem():');
	console.log('id:', id);

	try {
		const item = await em.findOne(InventoryItem, { id: id });
		console.log('item:', item);
		console.log('inventory-item.service.ts, getInventoryItem()^');
		console.log('');
		return item;
	} catch (ex) {
		return ex;
	}
}

async function removeInventoryItem(
	em: EntityManager,
	id: string
): Promise<Error | void> {
	if (!(em instanceof EntityManager)) {
		return Error('invalid request');
	}

	if (!id || typeof id !== 'string') {
		return Error('invalid params');
	}

	try {
		const item = await em.findOneOrFail(InventoryItem, { id: id });
		await em.removeAndFlush(item);
	} catch (ex) {
		return ex;
	}
}

async function updateInventoryItem(
	em: EntityManager,
	inventoryItem: Partial<InventoryItem>,
	id: string
): Promise<Error | InventoryItem> {
	if (!(em instanceof EntityManager)) return Error('invalid request');

	if (
		!inventoryItem ||
		typeof inventoryItem !== 'object' ||
		!inventoryItem.id ||
		id !== inventoryItem.id
	) {
		return Error('invalid params');
	}

	try {
		const item = await em.findOneOrFail(InventoryItem,
			{
				id: inventoryItem.id,
			}
		);
		wrap(item).assign(inventoryItem);	// se aplica modificarile asupra lui 'item', folosind obiectul primit ca parametru - 'inventoryItem'
		await em.persistAndFlush(item);	// se salveaza modificarile
		return item;
	} catch (ex) {
		return ex;
	}
}

async function addInventoryItem(
	em: EntityManager,
	inventoryItem: Partial<InventoryItem>
): Promise<Error | InventoryItem> {
	if (!(em instanceof EntityManager)) {
		return Error('invalid request');
	}

	if (!inventoryItem || typeof inventoryItem !== 'object' || inventoryItem.id) {
		return Error('invalid params');
	}

	try {
		const item = new InventoryItem(inventoryItem);

		console.log('');
		console.log('inventory-item.service.ts, addInventoryItem():');
		console.log('item:', item);
		console.log('');
		console.log('inventory-item.service.ts, addInventoryItem()^');

		await em.persistAndFlush(item);
		return item;
	} catch (ex) {
		return ex;
	}
}
*/