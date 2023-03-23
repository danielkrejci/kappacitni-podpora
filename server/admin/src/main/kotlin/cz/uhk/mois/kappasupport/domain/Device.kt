package cz.uhk.mois.kappasupport.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "DEVICES")
class Device(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("typeId")
    var typeId: Long,

    @Column("modelName")
    var modelName: String,

    @Column("serialNumber")
    var serialNumber: String,

    @Column("releaseDate")
    var releaseDate: Instant?,
)