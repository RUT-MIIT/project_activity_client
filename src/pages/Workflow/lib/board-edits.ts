import type { BoardRecord, Diff, Store } from '@quickdrawjs/core';

interface StrokeUpdate {
	offset: number;
	points: number[];
	done: boolean;
}

export interface BoardChanges {
	records: Record<string, BoardRecord>;
	removed: string[];
	strokes: Record<string, StrokeUpdate>;
}

function matchesExcept(left: object, right: object, ignore: string[]) {
	const a = Object.entries(left).filter(([key]) => !ignore.includes(key));
	const b = Object.entries(right).filter(([key]) => !ignore.includes(key));

	return (
		a.length === b.length &&
		a.every(([key, value]) =>
			Object.is(value, (right as Record<string, unknown>)[key])
		)
	);
}

function strokeUpdate(before: BoardRecord, after: BoardRecord) {
	if (
		before.typeName !== 'shape' ||
		after.typeName !== 'shape' ||
		before.type !== 'draw' ||
		after.type !== 'draw' ||
		!matchesExcept(before, after, ['props']) ||
		!matchesExcept(before.props, after.props, ['pts', 'done'])
	) {
		return null;
	}

	const oldPoints: unknown = before.props.pts;
	const newPoints: unknown = after.props.pts;

	if (
		!Array.isArray(oldPoints) ||
		!Array.isArray(newPoints) ||
		!oldPoints.every((point, index) => point === newPoints[index]) ||
		newPoints.length < oldPoints.length
	) {
		return null;
	}

	return {
		offset: oldPoints.length,
		points: newPoints.slice(oldPoints.length),
		done: after.props.done === true,
	};
}

export function encodeBoardChanges(diff: Diff, compact: boolean): BoardChanges {
	const changes: BoardChanges = {
		records: { ...diff.added },
		removed: Object.keys(diff.removed),
		strokes: {},
	};

	for (const [id, [before, after]] of Object.entries(diff.updated)) {
		const stroke = compact ? strokeUpdate(before, after) : null;

		if (stroke) {
			changes.strokes[id] = stroke;
		} else {
			changes.records[id] = after;
		}
	}

	return changes;
}

export function decodeBoardChanges(
	store: Store,
	changes: BoardChanges,
	localIds: Set<string> = new Set()
): Diff | null {
	const diff: Diff = { added: {}, updated: {}, removed: {} };

	for (const [id, { offset, points, done }] of Object.entries(
		changes.strokes
	)) {
		if (localIds.has(id)) {
			continue;
		}

		const previous = store.get(id);

		if (
			previous?.typeName !== 'shape' ||
			!Array.isArray(previous.props.pts) ||
			previous.props.pts.length !== offset
		) {
			return null;
		}

		diff.updated[id] = [
			previous,
			{
				...previous,
				props: {
					...previous.props,
					pts: previous.props.pts.concat(points),
					done,
				},
			},
		];
	}

	for (const [id, next] of Object.entries(changes.records)) {
		if (localIds.has(id)) {
			continue;
		}

		const previous = store.get(id);

		if (previous) {
			diff.updated[id] = [previous, next];
		} else {
			diff.added[id] = next;
		}
	}

	for (const id of changes.removed) {
		const previous = store.get(id);

		if (previous && !localIds.has(id)) {
			diff.removed[id] = previous;
		}
	}

	return diff;
}
