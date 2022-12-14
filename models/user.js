const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: false
        },
        profile: {
            type: String,
            required: false,
            unique: true
        }, 
        following: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                required: false
            }
        ]
    },
    {
        versionKey: false
    }
)

userSchema.methods.isValidPassword = async function(password){
    const user = this
    const compare = bcrypt.compareSync(password,user.password)
    return compare
}

userSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
    this.profile = slugify(this.name+' ' +this.last, {
        replacement: '-',
        lower: true, 
        strict: false,
        trim: true
    })
    next()
})


module.exports = mongoose.model('User', userSchema)
