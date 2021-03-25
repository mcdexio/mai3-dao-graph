import { BigInt, ethereum, log, Address } from "@graphprotocol/graph-ts"

import { Proposal, Vote } from '../generated/schema'

import { 
    ProposalCreated as ProposalCreatedEvent,
    ProposalExecuted as ProposalExecutedEvent,
    ProposalCanceled as ProposalCanceledEvent,
    ProposalQueued as ProposalQueuedEvent,
    VoteCast as VoteCastEvent,
} from '../generated/Governor/Governor'

import {
    BI_18,
    convertToDecimal,
    ZERO_BD,
    fetchUser,
    fetchDao,
    ZERO_BI,
} from './utils'

export function handleProposalCreated(event: ProposalCreatedEvent): void {
    let dao = fetchDao()
    let proposalId = event.params.id.toString()
    let proposal = new Proposal(proposalId)
    let user = fetchUser(event.params.proposer)
    proposal.proposer = user.id
    let targets = event.params.targets as Address[]
    proposal.targets = []
    let targetsStr = proposal.targets
    
    for (let index = 0; index < event.params.targets.length; index++) {
        targetsStr.push(targets[index].toHexString())
    }
    proposal.targets = targetsStr
    proposal.values = event.params.values
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
    proposal.isCancel = false
    proposal.eta = ZERO_BI
    proposal.save()
    dao.proposalCount += 1
    dao.save()
}
  
export function handleVote(event: VoteCastEvent): void {
    let user = fetchUser(event.params.voter)
    let proposalId = event.params.proposalId.toString()
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
    let proposalId = event.params.id.toString()
    let proposal = Proposal.load(proposalId)
    proposal.isExecuted = true
    proposal.save()
}

export function handleProposalQueued(event: ProposalQueuedEvent): void {
    let proposalId = event.params.id.toString()
    let proposal = Proposal.load(proposalId)
    proposal.eta = event.params.eta
    proposal.save()  
}

export function handleProposalCanceled(event: ProposalCanceledEvent): void {
    let proposalId = event.params.id.toString()
    let proposal = Proposal.load(proposalId)
    proposal.isCancel = true
    proposal.save()  
}