-- MySQL Script generated by MySQL Workbench
-- Tue Jan 26 19:08:04 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema epurchase
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema epurchase
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `epurchase` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `epurchase` ;

-- -----------------------------------------------------
-- Table `epurchase`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(45) NOT NULL,
  `postCode` VARCHAR(45) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `reputation` DECIMAL(10,0) NOT NULL,
  `isVerified` TINYINT(1) NOT NULL,
  `isAdmin` TINYINT(1) NOT NULL,
  `address_id` INT NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `surname` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `address_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `fk_users_address_idx` (`address_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_address`
    FOREIGN KEY (`address_id`)
    REFERENCES `epurchase`.`address` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`bank`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`bank` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` DECIMAL(10,0) NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`users_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `fk_bank_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `epurchase`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`delivery`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`delivery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `company` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `price` DECIMAL(10,0) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` DECIMAL(10,0) NOT NULL,
  `description` VARCHAR(1000) NOT NULL,
  `quantity` INT NOT NULL,
  `id_category` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 58
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contents` VARCHAR(100) NOT NULL,
  `UsersFrom` INT NOT NULL,
  `UsersTo` INT NOT NULL,
  PRIMARY KEY (`id`, `UsersFrom`, `UsersTo`),
  INDEX `fk_message_users1_idx` (`UsersFrom` ASC) VISIBLE,
  INDEX `fk_message_users2_idx` (`UsersTo` ASC) VISIBLE,
  CONSTRAINT `fk_message_users1`
    FOREIGN KEY (`UsersFrom`)
    REFERENCES `epurchase`.`users` (`id`),
  CONSTRAINT `fk_message_users2`
    FOREIGN KEY (`UsersTo`)
    REFERENCES `epurchase`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`opinions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`opinions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contents` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`orderdetails`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`orderdetails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `orderItems` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 36
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`refund`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`refund` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reason` VARCHAR(45) NOT NULL,
  `dateReturn` VARCHAR(45) NOT NULL,
  `order_id` INT NOT NULL,
  `order_users_id` INT NOT NULL,
  `order_users_address_id` INT NOT NULL,
  `order_cart_id` INT NOT NULL,
  `order_cart_offers_id` INT NOT NULL,
  `order_cart_offers_items_id` INT NOT NULL,
  `order_cart_offers_users_id` INT NOT NULL,
  PRIMARY KEY (`id`, `order_id`, `order_users_id`, `order_users_address_id`, `order_cart_id`, `order_cart_offers_id`, `order_cart_offers_items_id`, `order_cart_offers_users_id`),
  INDEX `fk_refund_order1_idx` (`order_id` ASC, `order_users_id` ASC, `order_users_address_id` ASC, `order_cart_id` ASC, `order_cart_offers_id` ASC, `order_cart_offers_items_id` ASC, `order_cart_offers_users_id` ASC) VISIBLE,
  CONSTRAINT `fk_refund_order1`
    FOREIGN KEY (`order_id` , `order_users_id` , `order_users_address_id` , `order_cart_id` , `order_cart_offers_id` , `order_cart_offers_items_id` , `order_cart_offers_users_id`)
    REFERENCES `epurchase`.`order` (`id` , `users_id` , `users_address_id` , `cart_id` , `cart_offers_id` , `cart_offers_items_id` , `cart_offers_users_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `epurchase`.`usercart`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `epurchase`.`usercart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `item_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `product_name` VARCHAR(45) NULL DEFAULT NULL,
  `price` DECIMAL(10,0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 140
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
