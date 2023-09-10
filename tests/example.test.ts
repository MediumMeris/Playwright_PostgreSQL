import { test, expect } from '@playwright/test';

const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "admin",
    database: "TestingBridge"
});


const testData = {
    actor_id: 300,
    first_name: "AutomationUser",
    last_name: "TestAutomationUser",
    last_update: "2030-01-01 15:15:15"
};

test.beforeAll(async ({}) => {
    console.log('=========== Tests started ===========')
    await client.connect();
});

test.afterAll(async ({}) => {
    await client.end();
    console.log('=========== Tests stoped ===========')
});


test('Test Case 01: Validate select query from DB', async () => {

    const joinQuery = `SELECT f.*, fa.actor_id
                  FROM film AS f
                  JOIN film_actor AS fa ON f.film_id = fa.film_id
                  WHERE fa.actor_id IN ('1', '3') 
                  LIMIT 15;`

    try {
        const queryResult = await client.query(joinQuery);

        expect(queryResult.rowCount).toBe(15);

        for (const row of queryResult.rows) {
            expect(row.release_year).toBe(2006);
        }

        console.log(queryResult.rows);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
});


test('Test Case 02: Insert INTO actor', async () => {

    const insertQuery = `INSERT INTO actor(actor_id, first_name, last_name, last_update)
                         VALUES ('${testData.actor_id}', '${testData.first_name}', '${testData.last_name}', '${testData.last_update}');`

    try {

        const queryResult = await client.query(insertQuery);
        expect(queryResult.rowCount).toBe(1);
        expect(queryResult.command).toBe('INSERT');

    } catch (err) {
        console.error(err.message);
        throw err;
    }
});

test('Test Case 03: SELECT new inserted actor', async () => {

    const selectQuery = `SELECT * FROM actor WHERE actor_id = ${testData.actor_id}`;

    try {
        const selectResult = await client.query(selectQuery);

        const firstRow = selectResult.rows[0];
        expect(firstRow.actor_id).toBe(testData.actor_id);
        expect(firstRow.first_name).toBe('AutomationUser');
        expect(firstRow.last_name).toBe('TestAutomationUser');
        console.log(selectResult.rows[0])
    } catch (err) {
        console.error(err.message);
        throw err;;
    }
});


test('Test Case 04: UPDATE inserted actor', async () => {

    const newTestData = {
        first_name: "AutomationUser_UPDATED",
        last_name: "TestAutomationUser_UPDATED"
    }

    const selectQuery = `UPDATE actor SET first_name = '${newTestData.first_name}', last_name = '${newTestData.last_name}'
                         WHERE actor_id = ${testData.actor_id}`;

    try {
        const selectResult = await client.query(selectQuery);

        expect(selectResult.rowCount).toBe(1);
        expect(selectResult.command).toBe('UPDATE')

    } catch (err) {
        console.error(err.message);
        throw err;;
    }
});


test('Test Case 05: DELETE actor', async () => {

    const deleteQuery = `DELETE FROM actor WHERE actor_id = ${testData.actor_id}`;

    try {
        const deleteResult = await client.query(deleteQuery);

        expect(deleteResult.rowCount).toBe(1);
        expect(deleteResult.command).toBe('DELETE')

    } catch (err) {
        console.error(err.message);
        throw err;;
    }
});