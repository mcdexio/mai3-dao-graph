import { BigInt, ethereum, log, Address } from "@graphprotocol/graph-ts"

import { Proposal, Vote } from '../generated/schema'

import { 
    ProposalCreated as ProposalCreatedEvent,
    ProposalExecuted as ProposalExecutedEvent,
    VoteCast as VoteCastEvent,
} from '../generated/templates/Governor/Governor'

import {
    BI_18,
    convertToDecimal,
    ZERO_BD,
    fetchUser,
} from './utils'

export function handleProposalCreated(event: ProposalCreatedEvent): void {
    let proposalId = event.address.toHexString()
        .concat("-")
        .concat(event.params.id.toString())
    let proposal = new Proposal(proposalId)
    let user = fetchUser(event.params.proposer)
    proposal.proposer = user.id
    proposal.signatures = event.params.signatures
    proposal.calldatas = event.params.calldatas
    proposal.timestamp = event.block.timestamp
    proposal.description = event.params.description
    proposal.startBlock = event.params.startBlock
    proposal.endBlock = event.params.endBlock
    proposal.quorumVotes = convertToDecimal(event.params.quorumVotes, BI_18)
    proposal.for = ZERO_BD
    proposal.against = ZERO_BD
    proposal.isExecuted = false
    proposal.save()
}
  
export function handleVote(event: VoteCastEvent): void {
    let user = fetchUser(event.params.account)
    let proposalId = event.address.toHexString()
        .concat("-")
        .concat(event.params.proposalId.toString())
    let proposal = Proposal.load(proposalId)
    let vote = new Vote(proposalId.concat('-').concat(user.id))
    vote.timestamp = event.block.timestamp
    vote.voter = user.id;
    vote.proposal = proposalId
    vote.support = event.params.support
    vote.votes = convertToDecimal(event.params.votes, BI_18)
    if (vote.support) {
        proposal.for += vote.votes
    } else {
        proposal.against += vote.votes
    }
    proposal.save()
    vote.save()
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
    let proposalId = event.address.toHexString()
        .concat("-")
        .concat(event.params.id.toString())
    let proposal = Proposal.load(proposalId)
    proposal.isExecuted = true
    proposal.save()
}
