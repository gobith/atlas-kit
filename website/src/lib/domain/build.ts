import type { Session } from '../domain/session';
import { v4 as uuidv4 } from 'uuid';

import { Province, ProvinceArea } from '../domain/domain';

import type { BorderData, AreaData } from '../domain/types';
import Polygon from '../domain/polygon';

import { storeBorders, borderDForArea, polylabelForD } from '../domain/nodes';

export const createProvince = (point: { x: number; y: number }, session: Session): Province => {
	const province = new Province({
		id: uuidv4(),
		level: 1,
		loyalty: 'Average',
		name: 'Test',
		owner: null,
		sourceRating: 6,
		terrain: { name: 'Light Forest', potential: 7, color: '#D4FFA9', modifiers: [] }
	});


	session.uuidToObjectMapping.set(province.id, province);
	session.provinces.push(province);

	const borders = rectangleBorders(point);
	storeBorders(borders);

	const area: AreaData = { p: province.id, borders: borders.map((b) => b.id) };
	const d = borderDForArea(area);
	const provinceArea = new ProvinceArea(area);
	const polygon = new Polygon(d);
	provinceArea.polygon = polygon;
	provinceArea.path = new Path2D(d);
	provinceArea.labelPoint = polylabelForD(d);
	provinceArea.province = province;
	province.descriptionArea = provinceArea;
	province.provinceAreas.push(provinceArea);
	session.provinceAreas.push(provinceArea);
	session.areas.push(area);

	session.updatePaths();

	return province;
};

const rectangleBorders = (point: { x: number; y: number }): BorderData[] => {
	const delta = 500;

	const border1: BorderData = {
		id: uuidv4(),
		a: '',
		b: '',
		d: `M ${point.x - delta} ${point.y - delta} L ${point.x - delta} ${point.y + delta}`
	};

	const border2: BorderData = {
		id: uuidv4(),
		a: '',
		b: '',
		d: `M ${point.x - delta} ${point.y + delta} L ${point.x + delta} ${point.y + delta}`
	};

	const border3: BorderData = {
		id: uuidv4(),
		a: '',
		b: '',
		d: `M ${point.x + delta} ${point.y + delta} L ${point.x + delta} ${point.y - delta}`
	};

	const border4: BorderData = {
		id: uuidv4(),
		a: '',
		b: '',
		d: `M ${point.x + delta} ${point.y - delta} L ${point.x - delta} ${point.y - delta}`
	};

	border1.a = border1.id;
	border1.b = border2.id;

	border2.a = border2.id;
	border2.b = border3.id;

	border3.a = border3.id;
	border3.b = border4.id;

	border4.a = border4.id;
	border4.b = border1.id;

	return [border1, border2, border3, border4];
};
