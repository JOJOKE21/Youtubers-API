const { response, request } = require("express");

const Pool = require("pg").Pool;

const creator = new Pool({
    user: "postgres",
    host: "youtubers-instance-1.c4iecfxp38me.us-east-1.rds.amazonaws.com",
    database: "youtubers",
    password: "postgres",
    port: 5432,
});

const getYoutubers = (request, response) => {
    creator.query("SELECT * FROM creators", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const addYoutubers = (req, res) => {
    try {
        console.log("rest",req)
        const { name, youtube_name, year_made } = req.body;
        creator.query(
            `INSERT INTO creators (name, youtube_name, year_made) VALUES ($1, $2, $3) RETURNING *;`,
            [name, youtube_name, year_made],
            (error, results) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                console.log(results)
                res.status(200).json(results.rows)
            }
        );
    } catch (error) {
        throw error;
    }
};

const deleteYoutuber = (request, response) => {
    const id = parseInt(request.params.id);
    creator.query(`DELETE FROM creators WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows)
    });
};

const getYoutuber = (request, response) => {
    const { id } = request.body;
    console.log(id)
    creator.query("SELECT * FROM creators WHERE id=$1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows)
    });
};

const updateYoutubers = (request, response) => {
    let { name, youtube_name, year_made, id } = request.body;
    let myPromis = new Promise(function (resovle, reject) {
        creator.query('SELECT * FROM creators WHERE id=$1', [id], (error, results) => {
            if (error) {
                throw error;
            } else if (response) {
                name = name !== undefined ? name : results.rows.name;
                youtube_name = youtube_name !== undefined ? youtube_name : results.rows.youtube_name
                year_made = year_made !== undefined ? year_made : results.rows.year_made;
                resovle(results.rows)
                return results.rows
            } else {
                reject()
            }
        })
    });

    myPromis.then(() => {
        try {
            creator.query(
                `UPDATE creators
                SET name=$1, youtube_name=$2, year_made=$3
                WHERE id = $4;`,
                [name, youtube_name, year_made, id],
                (error, results) => {
                    if (error) {
                        console.log(error)
                        throw error;
                    }
                    console.log(results)
                    response.status(200).json(results.rows)
                }
            );
        } catch (error) {
            throw error;
        }
    })
}

module.exports = {
    getYoutubers,
    addYoutubers,
    deleteYoutuber,
    getYoutuber,
    updateYoutubers
};