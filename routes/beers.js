const express = require('express');
const router = express.Router();

module.exports = (db) => {

  //get all beers  http://localhost:8080/api/beers
  router.get('/all', async (req, res) => {
    const allBeers = `SELECT * FROM beers ORDER BY name ASC;`;
    try {
      const beers = await db.query(allBeers);
      if (beers.rows.length === 0) {
        return res.status(404).send('No Contacts Available')
      }
      res.json(beers.rows)
      return beers.rows;
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error')
    }
  })


  // get single beer
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const singleBeer = `SELECT * FROM beers WHERE beers.id = $1;`
    try {
      const getSingleBeer = await db.query(singleBeer, [id]);
      if (getSingleBeer.rows.length === 0) {
        return res.status(404).send('Beer Unavailable')
      }
      res.json(getSingleBeer.rows);
      return getSingleBeer.rows;
    } catch (error) {
      console.error(error.message);
      res.status(404).send("Could not find Beer")
    }
  })


  //create beer
  router.post('/add', async (req, res) => {
    const values = [req.body.name, req.body.image, req.body.note, req.body.star];
    const createBeer = `INSERT INTO beers(
      name,
      image,
      note,
      star
      ) VALUES ($1, $2, $3, $4 ) RETURNING *;`;
    try {
      const newBeer = await db.query(createBeer, values);
      res.json(newBeer.rows);
      return newBeer.rows;
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error')
    }
  })

  
  //edit beer
  
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const values = [req.body.name, req.body.image, req.body.note, req.body.star];
    console.log(id);
    console.log(req.body.star);
    let editBeer = `UPDATE beers SET `
    
    if (req.body.name) {
      editBeer += `name = $1 , `
    }
    if (req.body.image) {
      editBeer += `image = $2 , `
    }
    if (req.body.note) {
      editBeer += `note = $3 , `
    }
    if (req.body.star) {
      editBeer += `star = $4 `
    }
    editBeer = editBeer.slice(0, -1);

    editBeer += ` WHERE id = ${id} RETURNING *;`

    try {
        const updateBeer = await db.query(editBeer, values);
        res.json("Beer was updated");
        return updateBeer.rows
      } catch (error) {
        console.error(error.message);
        res.status(404).send("Could not find beer")
      }
    })
  
  //


  // delete single beer
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const removeBeer = `DELETE FROM beers WHERE beers.id = $1;`;
    try {
      const deleteBeers = db.query(removeBeer, [id]);
      res.json("Beers was deleted");
    } catch (error) {
      console.log(error.message);
      res.status(404).send('Beers not found');
    }
  })


  return router;
}