const db = require("./db");
const modpacks = (callback) => {
	db.findAll("modpacks", callback);
};

const findModpack = (data, callback) => {
	db.find("modpacks", data, callback);
};

const addModpack = (data, callback) => {
	db.add("modpacks", data, callback);
};

const editModpack = (id, data, callback) => {
	db.edit("modpacks", id, data, callback);
};

const removeModpack = (id, callback) => {
	db.remove("modpacks", id, callback);
};
const getModpackOTW = (callback) => {
	modpacks((err, docs) => {
		if (err) callback(err, null);
		else if (docs.length > 0) {
			let best = { score: 0, mod: null };
			for (let i = 0; i < docs.length; i++) {
				const modpack = docs[i];
				const now = new Date();
				let likes = 0;
				for (let j = 0; j < modpack.likes.length; j++) {
					const likeData = modpack.likes[j];
					if (likeData.getWeek() !== now.getWeek()) continue;
					likes++;
				}
				let downloads = 0;
				for (let j = 0; j < modpack.downloads.length; j++) {
					const downloadData = modpack.downloads[j];
					if (downloadData.getWeek() !== now.getWeek()) continue;
					downloads++;
				}
				let seen = 0;
				for (let j = 0; j < modpack.seen.length; j++) {
					const seenData = modpack.seen[j];
					if (seenData.getWeek() !== now.getWeek()) continue;
					seen++;
				}
				let rated = likes + downloads;
				if (rated === 0) continue;
				let score = rated / seen;
				if (score >= bestScore) best = { score: score, modpack: modpack };
			}
			callback(null, best);
		} else callback(null, null);
	});
};

module.exports = { modpacks, findModpack, addModpack, editModpack, removeModpack, getModpackOTW };
