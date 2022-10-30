CREATE TABLE `wall_assignment`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `password` VARCHAR(100) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `index_users_on_email` (`email` ASC) VISIBLE);


CREATE TABLE `wall_assignment`.`messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NULL,
  `message` VARCHAR(5000) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `index_messages_on_user_id` (`user_id` ASC) VISIBLE);

CREATE TABLE `wall_assignment`.`comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `message_id` INT(11) NULL,
  `user_id` INT(11) NULL,
  `comment` VARCHAR(5000) NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `index_comments_on_message_id` (`message_id` ASC) INVISIBLE,
  INDEX `index_comments_on_user_id` (`user_id` ASC) VISIBLE);
