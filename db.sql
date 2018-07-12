
CREATE DATABASE IF NOT EXISTS el_chancellory;
use el_chancellory;


CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `scope` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `user_email_ind` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;


CREATE TABLE `docs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `text` longtext NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `title` varchar(256) NOT NULL,
  `assigned_to_id` int(11),
  PRIMARY KEY (`id`),
  KEY `docs_author_id_ind` (`author_id`),
  KEY `docs_ibfk_1_idx` (`assigned_to_id`),
  CONSTRAINT `docs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

CREATE TABLE `rsa_keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) NOT NULL,
  `pub_key` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `keys_owner_id_ind` (`owner_id`),
  CONSTRAINT `rsa_keys_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;


CREATE TABLE `signatures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `signature` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `document_id` (`document_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `signatures_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `docs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `signatures_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;


CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_document_id_ind` (`document_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `docs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;


CREATE TABLE `document_subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_id` int(11) NOT NULL,
  `subscriber_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `doc_subscribers_ibfk_1_idx` (`subscriber_id`),
  KEY `doc_subscribers_ibfk_2_idx` (`document_id`),
  CONSTRAINT `doc_subscribers_ibfk_1` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `doc_subscribers_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `docs` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;



CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `target_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `link` varchar(256) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_target_id_ind` (`target_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;


  
CREATE VIEW `comments_view` AS
    SELECT 
        `comments`.`id` AS `id`,
        `comments`.`author_id` AS `author_id`,
        `comments`.`document_id` AS `document_id`,
        `comments`.`text` AS `text`,
        `comments`.`created_at` AS `created_at`,
        CONCAT(`users`.`first_name`,
                ' ',
                `users`.`last_name`) AS `author`
    FROM
        (`comments`
        JOIN `users` ON ((`comments`.`author_id` = `users`.`id`)));
        

CREATE VIEW `docs_view` AS
    SELECT 
        `docs`.`id` AS `id`,
        `docs`.`author_id` AS `author_id`,
        `docs`.`assigned_to_id` AS `assigned_to_id`,
        `docs`.`text` AS `text`,
        `docs`.`created_at` AS `created_at`,
        `docs`.`title` AS `title`,
        `author`.`first_name` AS `first_name`,
        `author`.`last_name` AS `last_name`,
        `assignee`.`first_name` AS `assignee_first_name`,
        `assignee`.`last_name` AS `assignee_last_name`,
        `sign`.`signature` AS `signature`,
        `sign`.`created_at` AS `signed_at`,
        `sign`.`user_id` AS `signer_id`,
        `sign`.`first_name` AS `signer_first_name`,
        `sign`.`last_name` AS `signer_last_name`
    FROM
        `docs`
        JOIN `users` `author` ON `author`.`id` = `docs`.`author_id`
        LEFT JOIN `users` `assignee` ON `assignee`.`id` = `docs`.`assigned_to_id`
        LEFT JOIN `signatures_view` `sign` ON `sign`.`document_id` = `docs`.`id`;


  
CREATE VIEW `comments_view` AS
    SELECT 
        `comments`.`id` AS `id`,
        `comments`.`author_id` AS `author_id`,
        `comments`.`document_id` AS `document_id`,
        `comments`.`text` AS `text`,
        `comments`.`created_at` AS `created_at`,
        CONCAT(`users`.`first_name`,
                ' ',
                `users`.`last_name`) AS `author`
    FROM
        (`comments`
        JOIN `users` ON ((`comments`.`author_id` = `users`.`id`)));











DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_notifications_for_signature`(in document_id int, in author_id int)
BEGIN

	DECLARE author_name varchar(256);
    DECLARE document_title varchar(256);
    DECLARE sub_id int;
    
    DECLARE tCount INT;
    
    DECLARE bDone INT;
	DECLARE curs CURSOR FOR SELECT ds.subscriber_id FROM Document_Subscribers ds WHERE ds.document_id = document_id;
    
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET bDone = 1;
    
    DROP TEMPORARY TABLE IF EXISTS tblResults;
    CREATE TEMPORARY TABLE IF NOT EXISTS tblResults  (
		auth_id int
    );
    
    select concat(first_name, " ", last_name) into author_name from Users where id=author_id;
    select title into document_title from Docs where id=document_id;

	OPEN curs;

	SET bDone = 0;
	REPEAT
	FETCH curs INTO sub_id;

	IF sub_id <> author_id then
		select count(*) into tCount from tblResults where auth_id=sub_id;
        if tCount = 0 then
			INSERT INTO Notifications (target_id, `text`, link, created_at) VALUES (sub_id, concat(author_name, ' has signed on ', document_title), concat('/documents/', document_id), now());
			INSERT INTO tblResults values (sub_id);
        END if;
    END IF;
	UNTIL bDone END REPEAT;

	CLOSE curs;
    DROP TEMPORARY TABLE IF EXISTS tblResults;

END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_notifications_for_new_comment`(in document_id int, in author_id int)
BEGIN

	DECLARE author_name varchar(256);
    DECLARE document_title varchar(256);
    DECLARE sub_id int;
    
    DECLARE tCount INT;
    
    DECLARE bDone INT;
	DECLARE curs CURSOR FOR SELECT ds.subscriber_id FROM Document_Subscribers ds WHERE ds.document_id = document_id;
    
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET bDone = 1;
    
    DROP TEMPORARY TABLE IF EXISTS tblResults;
    CREATE TEMPORARY TABLE IF NOT EXISTS tblResults  (
		auth_id int
    );
    
    select concat(first_name, " ", last_name) into author_name from Users where id=author_id;
    select title into document_title from Docs where id=document_id;

	OPEN curs;

	SET bDone = 0;
	REPEAT
	FETCH curs INTO sub_id;

	IF sub_id <> author_id then
		select count(*) into tCount from tblResults where auth_id=sub_id;
        if tCount = 0 then
			INSERT INTO Notifications (target_id, `text`, link, created_at) VALUES (sub_id, concat(author_name, ' has written a new comment on ', document_title), concat('/documents/', document_id), now());
			INSERT INTO tblResults values (sub_id);
        END if;
    END IF;
	UNTIL bDone END REPEAT;

	CLOSE curs;
    DROP TEMPORARY TABLE IF EXISTS tblResults;

END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_notifications_for_document_assignment`(in document_id int, in assignee_id int)
BEGIN

	DECLARE assignee_name varchar(256);
    DECLARE document_title varchar(256);
    DECLARE sub_id int;
    
    DECLARE tCount INT;
    
    DECLARE bDone INT;
	DECLARE curs CURSOR FOR SELECT ds.subscriber_id FROM Document_Subscribers ds WHERE ds.document_id = document_id;
    
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET bDone = 1;
    
    DROP TEMPORARY TABLE IF EXISTS tblResults;
    CREATE TEMPORARY TABLE IF NOT EXISTS tblResults  (
		auth_id int
    );
    
    select concat(first_name, " ", last_name) into assignee_name from Users where id=assignee_id;
    select title into document_title from Docs where id=document_id;

	OPEN curs;

	SET bDone = 0;
	REPEAT
	FETCH curs INTO sub_id;

	IF sub_id <> assignee_id then
		select count(*) into tCount from tblResults where auth_id=sub_id;
        if tCount = 0 then
			INSERT INTO Notifications (target_id, `text`, link, created_at) VALUES (sub_id, concat(document_title, ' was assigned to ', assignee_name), concat('/documents/', document_id), now());
			INSERT INTO tblResults values (sub_id);
        END if;
    END IF;
	UNTIL bDone END REPEAT;
    INSERT INTO Notifications (target_id, `text`, link, created_at) VALUES (assignee_id, concat(document_title, ' was assigned to YOU'), concat('/documents/', document_id), now());

	CLOSE curs;
    DROP TEMPORARY TABLE IF EXISTS tblResults;

END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_subscriber`(in document_id int, in author_id int)
BEGIN
	
    DECLARE tCount int;
	
    select count(*) into tCount from Document_Subscribers ds where ds.document_id=document_id and ds.subscriber_id=author_id;
    if tCount = 0 then
		INSERT INTO Document_Subscribers (subscriber_id, document_id) values (author_id, document_id);
	end if;

END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `change_assignee`(in document_id int, in assignee_id int)
BEGIN
	
    UPDATE Docs SET assigned_to_id=assignee_id where id=document_id;
	call create_notifications_for_document_assignment(document_id, assignee_id);

END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER after_comments_insert
AFTER INSERT ON Comments
FOR EACH ROW BEGIN

	DECLARE tCount int;
	
    call create_notifications_for_new_comment(NEW.document_id, NEW.author_id);
    call add_subscriber(NEW.document_id, NEW.author_id);
    
END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER after_documents_insert
AFTER INSERT ON Docs
FOR EACH ROW BEGIN

	INSERT INTO Document_Subscribers (subscriber_id, document_id) values (NEW.author_id, NEW.id);
    
END$$
DELIMITER ;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER after_signature_insert
AFTER INSERT ON Signatures
FOR EACH ROW BEGIN

	call create_notifications_for_signature(NEW.document_id, NEW.user_id);
    call add_subscriber(NEW.document_id, NEW.user_id);
    
END$$
DELIMITER ;