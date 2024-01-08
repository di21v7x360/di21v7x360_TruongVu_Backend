const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, 'Name can not be empty'));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while creating the contact')
        );
    }
}


// Xử lý chức năng tìm tất cả liên hệ 
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while retrieving contacts'));
    }
    return res.send(documents);
}

// Xử lý chức năng tìm một liên hệ
exports.findOne = async (req, res, next) => {
    // res.send({message: "findOne handler"});
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        return document
            ? res.send(document)
            : next(new ApiError(404, 'contact not found'));
    } catch (error) {
        return next(new ApiError(500, 'Error retrieving contact'));
    }
}



// Xử lý chức năng cập nhật liên hệ

exports.update = async (req, res, next) => {
    // res.send({message: "update handler"});
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was updated successfully"});
    } catch (error) {
        return next(new ApiError(500, `Error updating contact with id = ${req.params.id}`));
    }
}



// Xử lý chức năng xóa một liên hệ

exports.delete = async (req, res, next) => {
    // res.send({message: "delete handler"});
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was delete successfully"});
    } catch (error) {
        return next(new ApiError(500, `Could not delete contact with id = ${req.params.id}`));
    }
}


// Xử lý chức năng tìm tất cả liên hệ được yêu thích

exports.findAllFavorite = async (_req, res, next) => {
    // res.send({message: "findAllFavorite handler"});
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findFavorite();
        return res.send(documents);
    }
    catch(error) {
        return next(new ApiError(500, 'An error occurred while retrieving favorite contacts'));
    }
}



// Xử lý chức năng xóa tất cả liên hệ

exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({message: `${deletedCount} contacts was deleted successfully`})
    } catch (error) {
        return next(new ApiError(500, 'Error updating contact'));
    }
}

