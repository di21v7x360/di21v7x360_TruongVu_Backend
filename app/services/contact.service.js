const { ObjectId  } = require("mongodb");

class ContactService {
    constructor(client) {
        // Colection contacs in mongodb
        this.Contact = client.db().collection('contacts');
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

    extractConactData(payload) {

        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };

        // Xóa các trường có giá trị là undefined
        Object.keys(contact).forEach((key) => {
                contact[key] === undefined && delete contact[key];
            } 
        );

        return contact;
    }

    async create(payload) {
        const contact = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: 'after', upsert: true }
        );
        return result;
    }


    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: 'i' },
        });
    }

    async findById(id) {
        console.log(ObjectId.isValid(id));
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }


    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: 'after' }
        );
        return result;
    }


    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    


    async findFavorite() {
        return await this.find({ favorite: true });
    }


    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }


}

module.exports = ContactService;