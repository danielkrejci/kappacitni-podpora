package cz.uhk.mois.client.domain

import cz.uhk.mois.client.controller.model.DeviceType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "DEVICES")
class Device(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    @Enumerated(EnumType.STRING)
    var type: DeviceType,

    @Column("modelname")
    var modelName: String,
    @Column("serialnumber")
    var serialNumber: String
)