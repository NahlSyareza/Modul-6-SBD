const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,

	ssl: {
		require: true,
	},
});

pool.connect().then(() => {
	console.log("Connected to PostgreSQL database");
});

async function addEvent(req, res) {
	const { title, description, year, period, month, day, country, city } = req.body;

	try {
		const result = await pool.query(
			'INSERT INTO historical_events (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [title, description, year, period, month, day, country, city]
		);

		const newEvent = result.rows[0];
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function getAllEvents(req, res) {

	try {
		const result = await pool.query(
			'SELECT * FROM historical_events'
		);

		const newEvent = result.rows;
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function updateEvent(req, res) {
	const { title, description, year, period, month, day, country, city, id } = req.body;

	try {
		const result = await pool.query(
			'UPDATE historical_events SET title=$1, description=$2, year=$3, period=$4, month=$5, day=$6, country=$7, city=$8 WHERE id=$9 RETURNING *', [title, description, year, period, month, day, country, city, id]
		);

		const newEvent = result.rows[0];
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function deleteEvent(req, res) {
	const { id } = req.body;

	try {
		const result = await pool.query(
			'DELETE FROM historical_events WHERE id=$1 RETURNING *', [id]
		);

		const newEvent = result.rows[0];
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function bulk(req, res) {
	const { title, description, year, period, month, day, country, city } = req.body;

	try {
		let validate = title.length + description.length + year.length + period.length + month.length + day.length + country.length + city.length;
		if (validate % 8 != 0) {
			res.status(500).json({ error: "Unmatching array length" });
		} else {
			for (let i = 0; i < title.length; i++) {
				await pool.query(
					'INSERT INTO historical_events (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [title[i], description[i], year[i], period[i], month[i], day[i], country[i], city[i]]
				);
			}
			res.status(201).json(req.body);
		}
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function country(req, res) {
	const { country } = req.body;

	try {
		const result = await pool.query(
			'SELECT * FROM historical_events WHERE country = $1', [country]
		);

		const newEvent = result;
		res.status(200).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

async function paginate(req, res) {
	const{pageSize, page} = req.body;

	try {
		let pageReal = page * pageSize;
		const result = await pool.query(
			'SELECT * FROM historical_events LIMIT $1 OFFSET $2', [pageSize, pageReal]
		);

		const newEvent = result;
		res.status(200).json(newEvent);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Errors" });
	}
}

module.exports = {
	addEvent,
	getAllEvents,
	updateEvent,
	deleteEvent,
	bulk,
	country,
	paginate
};