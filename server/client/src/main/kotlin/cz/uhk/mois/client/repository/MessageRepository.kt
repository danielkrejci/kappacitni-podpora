package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Message
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface MessageRepository : ReactiveCrudRepository<Message, Long>