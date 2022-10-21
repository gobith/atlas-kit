import { writable } from 'svelte/store';
import { Regent, Domain, Province, Holding, ProvinceArea, RealmArea } from '../domain/domain';
import { Session } from '../domain/session';
import {
	storeBorders,
	borderPathForAreas,
	provinceBordersPathForAreas,
	borderDForArea,
	polylabelForD,
	borderDForAreas
} from '../domain/nodes';
import Polygon from '../domain/polygon';
import AreaQuadTree from '../domain/quadtree';
import type { UUID, WorldData, MapData } from '../domain/types';

const session = writable<Session | null>(null);

export default session;

const urls = ['/world.json', '/mapNew.json'];

Promise.all(urls.map((url) => fetch(url)))
	.then((resp) => Promise.all(resp.map((r) => r.json())))
	.then((result) => {
		session.set(createSession(result[0], result[1]));
	});

const createSession = (worldData: WorldData, mapData: MapData) => {
	storeBorders(mapData.borders);

	type Data = {
		uuidToObjectMapping: Map<UUID, any>;
		namedEntities: any[];
		regents: Regent[];
		domains: Domain[];
		provinces: Province[];
		holdings: Holding[];
		provinceAreas: ProvinceArea[];
		islandsPath: Path2D;
		provinceBordersPath: Path2D;
		woodsPath: Path2D;
		mountainsPath: Path2D;
		tree: AreaQuadTree | null;
	};

	const data: Data = {
		uuidToObjectMapping: new Map<UUID, any>(),
		namedEntities: [],
		regents: [],
		domains: [],
		provinces: [],
		holdings: [],
		provinceAreas: [],
		islandsPath: borderPathForAreas(mapData.areas),
		provinceBordersPath: provinceBordersPathForAreas(mapData.areas),
		woodsPath: new Path2D(),
		mountainsPath: new Path2D(),
		tree: null
	};

	worldData.regents.forEach((objectData) => {
		const object = new Regent(objectData);
		data.uuidToObjectMapping.set(object.id, object);
		data.namedEntities.push(object);
		data.regents.push(object);
	});

	worldData.domains.forEach((objectData) => {
		const object = new Domain(objectData);
		data.uuidToObjectMapping.set(object.id, object);
		data.namedEntities.push(object);
		data.domains.push(object);
	});

	worldData.provinces.forEach((objectData) => {
		const object = new Province(objectData);
		data.uuidToObjectMapping.set(object.id, object);
		data.namedEntities.push(object);
		data.provinces.push(object);
	});

	worldData.holdings.forEach((objectData) => {
		const object = new Holding(objectData);
		data.uuidToObjectMapping.set(object.id, object);
		data.holdings.push(object);
	});

	worldData.domains.forEach((objectData) => {
		const object = data.uuidToObjectMapping.get(objectData.id);
		object.owner = data.uuidToObjectMapping.get(objectData.owner);
		if (object.owner) {
			object.owner.domains.push(object);
		}
	});

	worldData.provinces.forEach((objectData) => {
		const object = data.uuidToObjectMapping.get(objectData.id);
		object.owner = data.uuidToObjectMapping.get(objectData.owner);
		object.owner.provinces.push(object);
	});

	worldData.holdings.forEach((objectData) => {
		const object = data.uuidToObjectMapping.get(objectData.id);
		object.owner = data.uuidToObjectMapping.get(objectData.owner);
		object.owner.holdings.push(object);
		object.province = data.uuidToObjectMapping.get(objectData.province);
		object.province.holdings.push(object);
	});

	data.namedEntities.sort(function (a, b) {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});

	mapData.woodAreas.forEach((area) => {
		data.woodsPath.addPath(new Path2D(area.d));
	});

	mapData.mountainAreas.forEach((area) => {
		data.mountainsPath.addPath(new Path2D(area.d));
	});

	mapData.areas.forEach((area) => {
		const d = borderDForArea(area);
		const provinceArea = new ProvinceArea(area);
		const polygon = new Polygon(d);
		provinceArea.polygon = polygon;
		provinceArea.path = new Path2D(d);
		provinceArea.labelPoint = polylabelForD(d);
		const province = data.uuidToObjectMapping.get(area.p);
		provinceArea.province = province;
		if (province) {
			if (!province.descriptionArea) {
				province.descriptionArea = provinceArea;
			}
			province.provinceAreas.push(provinceArea);
		}
		data.provinceAreas.push(provinceArea);
	});

	data.tree = new AreaQuadTree(data.provinceAreas);

	data.domains.forEach((domain) => {
		const realmAreas = domain.areas();
		if (realmAreas.length === 0) {
			return;
		}
		const realmArea = new RealmArea(domain);
		const d = borderDForAreas(realmAreas);
		realmArea.path = new Path2D(d);
		realmArea.labelPoint = polylabelForD(d);
		domain.realmArea = realmArea;
	});

	console.log(new Session(data));
	console.log(data);
	return new Session(data);
};
