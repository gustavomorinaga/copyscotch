import { generateUUID } from '$lib/utils';
import type { TFolderInfer, TFileInfer } from '$lib/validators';

/**
 * Finds a folder in an array of folders based on a given search term.
 * @param folders - The array of folders to search in.
 * @param term - The search term to match against the folders.
 * @returns The found folder, if any. Otherwise, undefined.
 */
export function findFolder(
	folders: Array<TFolderInfer>,
	term: Partial<TFolderInfer>
): TFolderInfer | undefined {
	const termEntries = Object.entries(term);

	for (const folder of folders) {
		let found = true;

		for (const [key, value] of termEntries) {
			const isMatch = folder[key as keyof TFolderInfer] !== value;
			if (!isMatch) continue;

			found = false;
			break;
		}

		if (found) return folder;

		const foundInSubFolder = findFolder(folder.folders, term);
		if (foundInSubFolder) return foundInSubFolder;
	}

	return undefined;
}

/**
 * Finds a file in the given array of folders based on the provided search term.
 * @param folders - An array of folders to search in.
 * @param term - The search term to match against the files.
 * @returns The found file, if any. Otherwise, undefined.
 */
export function findFile(
	folders: Array<TFolderInfer>,
	term: Partial<TFileInfer>
): TFileInfer | undefined {
	const termEntries = Object.entries(term);

	for (const folder of folders) {
		for (const file of folder.requests) {
			let found = true;

			for (const [key, value] of termEntries) {
				const isMatch = file[key as keyof TFileInfer] !== value;
				if (!isMatch) continue;

				found = false;
				break;
			}

			if (found) return file;
		}

		const foundInSubFolder = findFile(folder.folders, term);
		if (foundInSubFolder) return foundInSubFolder;
	}

	return undefined;
}

/**
 * Filters a tree of collections, folders, and requests based on a search term.
 * @param collections - The array of collections to filter.
 * @param term - The search term to filter by, which can be the name of a collection or a request.
 * @returns The filtered array of collections that match the search term.
 */
export function filterTree(
	collections: Array<TFolderInfer>,
	term: TFolderInfer['name'] | TFileInfer['name']
): Array<TFolderInfer> {
	const filterText = term.toLowerCase();
	const filteredCollections = [];

	const isMatch = (text: string) => text.toLowerCase().includes(filterText);

	for (const collection of collections) {
		const filteredFiles = [];
		const filteredFolders = [];
		for (const request of collection.requests) {
			if (isMatch(request.name)) filteredFiles.push(request);
		}
		for (const folder of collection.folders) {
			if (isMatch(folder.name)) filteredFolders.push(folder);
			const filteredFolderFiles = [];
			for (const request of folder.requests) {
				if (isMatch(request.name)) filteredFolderFiles.push(request);
			}
			if (filteredFolderFiles.length > 0) {
				const filteredFolder = Object.assign({}, folder);
				filteredFolder.requests = filteredFolderFiles;
				filteredFolders.push(filteredFolder);
			}
		}

		if (filteredFiles.length + filteredFolders.length > 0 || isMatch(collection.name)) {
			const filteredCollection = Object.assign({}, collection);
			filteredCollection.requests = filteredFiles;
			filteredCollection.folders = filteredFolders;
			filteredCollections.push(filteredCollection);
		}
	}

	return filteredCollections;
}

/**
 * Creates a new folder in the tree structure based on the given criteria.
 *
 * @param folders - The array of folders representing the tree structure.
 * @param term - The partial folder object used as the search criteria.
 * @param newFolder - The new folder object to be added.
 * @returns The updated array of folders with the new folder added.
 */
export function createFolder(
	folders: Array<TFolderInfer>,
	term: Partial<TFolderInfer>,
	newFolder: TFolderInfer
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	if (!termEntries.length) return [...folders, newFolder];

	return folders.map((folder) => {
		const found = termEntries.every(([key, value]) => folder[key as keyof TFolderInfer] === value);
		if (found) {
			return { ...folder, folders: [...folder.folders, newFolder] };
		}

		const updatedSubFolders = createFolder(folder.folders, term, newFolder);
		if (updatedSubFolders !== folder.folders) {
			return { ...folder, folders: updatedSubFolders } as TFolderInfer;
		}

		return folder;
	});
}

/**
 * Creates a new file in the tree explorer.
 *
 * @param folders - The array of folders representing the tree structure.
 * @param term - The partial folder object used to search for the target folder.
 * @param newFile - The new file to be added to the target folder.
 * @returns The updated array of folders with the new file added.
 */
export function createFile(
	folders: Array<TFolderInfer>,
	term: Partial<TFolderInfer>,
	newFile: TFileInfer
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	return folders.map((folder) => {
		const found = termEntries.every(([key, value]) => folder[key as keyof TFolderInfer] === value);
		if (found) {
			return { ...folder, requests: [...folder.requests, newFile] } as TFolderInfer;
		}

		const updatedSubFolders = createFile(folder.folders, term, newFile);
		if (updatedSubFolders !== folder.folders) {
			return { ...folder, folders: updatedSubFolders } as TFolderInfer;
		}

		return folder;
	});
}

/**
 * Updates the folders in the given array based on the provided search term and update object.
 * If a folder matching the search term is found, it will be updated with the properties from the update object.
 * If no matching folder is found, the original array of folders is returned.
 * The function recursively updates sub-folders as well.
 *
 * @param folders - The array of folders to update.
 * @param term - The search term used to find the folder(s) to update.
 * @param update - The object containing the properties to update in the matching folder(s).
 * @returns The updated array of folders.
 */
export function updateFolder(
	folders: Array<TFolderInfer>,
	term: Partial<TFolderInfer>,
	update: Partial<TFolderInfer>
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	return folders.map((folder) => {
		const found = termEntries.every(([key, value]) => folder[key as keyof TFolderInfer] === value);
		if (found) return { ...folder, ...update } as TFolderInfer;

		const updatedSubFolders = updateFolder(folder.folders, term, update);
		if (updatedSubFolders !== folder.folders) {
			return { ...folder, folders: updatedSubFolders } as TFolderInfer;
		}

		return folder;
	});
}

/**
 * Updates a file in a tree of folders.
 *
 * @param folders - The array of folders representing the tree structure.
 * @param term - The partial file object used to find the file to update.
 * @param update - The partial file object containing the updates to apply.
 * @returns The updated array of folders.
 */
export function updateFile(
	folders: Array<TFolderInfer>,
	term: Partial<TFileInfer>,
	update: Partial<TFileInfer>
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	return folders.map((folder) => {
		const foundFile = folder.requests.find((file) =>
			termEntries.every(([key, value]) => file[key as keyof TFileInfer] === value)
		);

		if (foundFile) {
			const updatedFiles = folder.requests.map((file) =>
				file === foundFile ? { ...file, ...update } : file
			);
			return { ...folder, requests: updatedFiles } as TFolderInfer;
		}

		const updatedSubFolders = updateFile(folder.folders, term, update);
		if (updatedSubFolders !== folder.folders) {
			return { ...folder, folders: updatedSubFolders } as TFolderInfer;
		}

		return folder;
	});
}

/**
 * Removes folders from the given array based on the provided term.
 * @param folders - The array of folders to remove from.
 * @param term - The partial term used to match and remove folders.
 * @returns The updated array of folders after removing the matching folders.
 */
export function removeFolder(
	folders: Array<TFolderInfer>,
	term: Partial<TFolderInfer>
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	return folders.reduce((acc, folder) => {
		const found = termEntries.every(([key, value]) => folder[key as keyof TFolderInfer] === value);
		if (found) return acc;

		const updatedSubFolders = removeFolder(folder.folders, term);
		if (updatedSubFolders !== folder.folders) {
			acc.push({ ...folder, folders: updatedSubFolders });
		} else {
			acc.push(folder);
		}

		return acc;
	}, [] as Array<TFolderInfer>);
}

/**
 * Removes files from an array of folders based on a given term.
 * @param folders - The array of folders to remove files from.
 * @param term - The partial term used to filter the files.
 * @returns The updated array of folders after removing the files.
 */
export function removeFile(
	folders: Array<TFolderInfer>,
	term: Partial<TFileInfer>
): Array<TFolderInfer> {
	const termEntries = Object.entries(term);

	return folders.map((folder) => {
		const foundFile = folder.requests.find((file) =>
			termEntries.every(([key, value]) => file[key as keyof TFileInfer] === value)
		);

		if (foundFile) {
			const updatedFiles = folder.requests.filter((file) => file !== foundFile);
			const updatedSubFolders = removeFile(folder.folders, term);
			return { ...folder, requests: updatedFiles, folders: updatedSubFolders };
		}

		const updatedSubFolders = removeFile(folder.folders, term);
		if (updatedSubFolders !== folder.folders) {
			return { ...folder, folders: updatedSubFolders };
		}

		return folder;
	});
}

/**
 * Sets new IDs for the collections, folders, and requests in the given array.
 * @param collections - An array of collections.
 * @returns An array of collections with new IDs.
 */
export function setNewIDs(collections: Array<TFolderInfer>): Array<TFolderInfer> {
	return collections.map((collection) => {
		const newCollection = { ...collection, id: generateUUID() };
		newCollection.folders = setNewIDs(collection.folders);
		newCollection.requests = collection.requests.map((request) => ({ ...request, id: generateUUID() }));
		return newCollection;
	});
}
