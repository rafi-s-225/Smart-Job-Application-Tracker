const express = require('express')
const router = express.Router()
const JobApplication = require("../models/JobApplication")

router.get("/",async(req,res) =>{
    try {
        const applications = await JobApplication.find()
        res.json(applications)
    }catch(err) {
        res.status(500).join({message : err.message})
    }
})

router.post("/",async (req,res) => {
    try {
        const newApplication = new JobApplication({
            companyName : req.body.companyName,
            jobRole : req.body.jobRole,
            applicationDate : req.body.applicationDate,
            status : req.body.status,
            deadline : req.body.deadline,
            notes : req.body.notes
        })
        const savedApplication = await newApplication.save()
        res.status(201).json(savedApplication)
    } catch (err) {
        res.status(400).json({message : err.message})
    }
})

router.put("/:id", async(req,res) => {
    try {
        const updatedApplication = await JobApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        res.json(updatedApplication)
    } catch (err){
        res.status(400).json({message :err.message})
    }
})

router.delete("/:id", async(req,res) =>{
    try {
        await JobApplication.findByIdcAndDelete(req.params.id)
        res.json({messsage: "Job application deleted"})

    } catch(err){
        res.status(500).json({message: err.message})
    }

})

module.exports = router


