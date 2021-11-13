SELECT
        e.id AS ID,
    e.first_name AS FIRST,
    e.last_name AS LAST,
    e.role_id AS ROLE,
    r.salary AS Salary,
    m.last_name AS Manager, 
    d.name AS department

    FROM employee employee
    LEFT join employee m
                ON e.manager_id = m.id
    

    LEFT JOIN role r
                ON e.role_id = r.title

    LEFT JOIN department d
                ON r.department_id = d.id