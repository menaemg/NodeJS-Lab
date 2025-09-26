create table users(
    id int primary key auto_increment,
    name varchar(100) not null,
    email varchar(255) not null unique,
    password_hash varchar(255),
    age int not null,
    created_at timestamp default current_timestamp
)