CREATE DATABASE IF NOT EXISTS el_chancellory;
use el_chancellory;


drop table if exists RSA_Keys;
drop table if exists Signatures;
drop table if exists Docs;
drop table if exists Users;
drop view if exists docs_view;
drop view if exists signatures_view;


CREATE TABLE Users (
	id int not null auto_increment primary key,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(255) NOT NULL,
    scope varchar(100) NOT NULL,
    INDEX user_email_ind (email)
);

CREATE TABLE Docs (
	id int not null auto_increment primary key,
	author_id int not null,
    title varchar(256) not null,
	`text` longtext NOT NULL,
    created_at datetime,
    INDEX docs_author_id_ind (author_id),
    FOREIGN KEY (author_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE TABLE RSA_Keys (
	id int not null auto_increment primary key,
    owner_id int not null,
	pub_key text NOT NULL,
    created_at datetime,
    INDEX keys_owner_id_ind (owner_id),
    FOREIGN KEY (owner_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);


CREATE TABLE Signatures (
	id int not null auto_increment primary key,
    document_id int not null,
    user_id int not null,
    signature text not null,
    created_at datetime,
    FOREIGN KEY (document_id)
        REFERENCES Docs(id)
        ON DELETE CASCADE,
	FOREIGN KEY (user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

  
CREATE VIEW signatures_view as
	SELECT sign.*, signer.first_name, signer.last_name
		from Signatures as sign
        join Users as signer on signer.id = sign.user_id;
        

CREATE VIEW docs_view as
	SELECT docs.*, author.first_name, author.last_name, sign.signature, sign.created_at as signed_at, sign.user_id as signer_id, sign.first_name as signer_first_name, sign.last_name as signer_last_name
		from Docs
        join Users as author on author.id = Docs.author_id
        left join signatures_view as sign on sign.document_id = Docs.id;
      
        

