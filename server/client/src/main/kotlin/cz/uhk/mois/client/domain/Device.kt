package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.*

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