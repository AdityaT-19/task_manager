-- Active: 1701363874309@@viaduct.proxy.rlwy.net@43845@railway
CREATE DATABASE IF NOT EXISTS TASK;

--USE TASK;

USE railway;

CREATE TABLE IF NOT EXISTS USER (
    id INTEGER PRIMARY KEY ,
    name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS task (
    task_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    tname TEXT NOT NULL,
    comptime DATETIME,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES USER(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    priority INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS TAGS (
    tag_name VARCHAR(100) NOT NULL,
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE,
    PRIMARY KEY(tag_name, task_id)
);

INSERT INTO USER (id,name) VALUES (1,'user1');
INSERT INTO USER (id,name) VALUES (2,'user2');
INSERT INTO USER (id,name) VALUES (3,'user3');

INSERT INTO task (tname, comptime, completed, user_id, content, priority) VALUES ('task1', '2021-09-01 00:00:00', 0, 1, 'content1', 1);
INSERT INTO task (tname, comptime, completed, user_id, content, priority) VALUES ('task2', '2021-09-02 00:00:00', 0, 1, 'content2', 2);
INSERT INTO task (tname, comptime, completed, user_id, content, priority) VALUES ('task3', '2021-09-03 00:00:00', 0, 2, 'content3', 3);

INSERT INTO TAGS (tag_name, task_id) VALUES ('tag1', 1);
INSERT INTO TAGS (tag_name, task_id) VALUES ('tag2', 1);
INSERT INTO TAGS (tag_name, task_id) VALUES ('tag3', 2);
INSERT INTO TAGS (tag_name, task_id) VALUES ('tag2', 2);
