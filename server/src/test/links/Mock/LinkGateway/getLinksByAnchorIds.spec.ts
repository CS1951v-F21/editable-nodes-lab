import { ILink, isSameLink, makeILink } from '../../../../types'
import { LinkGateway } from '../../../../links'

import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Unit Test: findLinksByAnchorIds', () => {
  let uri
  let mongoClient
  let linkGateway
  let mongoMemoryServer

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create()
    uri = mongoMemoryServer.getUri()
    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    linkGateway = new LinkGateway(mongoClient)
    mongoClient.connect()
  })

  beforeEach(async () => {
    const response = await linkGateway.deleteAll()
    expect(response.success).toBeTruthy()
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongoMemoryServer.stop()
  })

  test('gets links when given valid anchorIds', async () => {
    const validLink1: ILink = makeILink('link1', 'anchor1', 'anchor2')
    const createResponse1 = await linkGateway.createLink(validLink1)
    expect(createResponse1.success).toBeTruthy()
    const validLink2: ILink = makeILink('link2', 'anchor2', 'anchor1')
    const createResponse2 = await linkGateway.createLink(validLink2)
    expect(createResponse2.success).toBeTruthy()
    const validLink3: ILink = makeILink('link3', 'anchor3', 'anchor2')
    const createResponse3 = await linkGateway.createLink(validLink3)
    expect(createResponse3.success).toBeTruthy()
    const validLink4: ILink = makeILink('link4', 'anchor3', 'anchor1')
    const createResponse4 = await linkGateway.createLink(validLink4)
    expect(createResponse4.success).toBeTruthy()
    const validLink5: ILink = makeILink('link5', 'anchor3', 'anchor4')
    const createResponse5 = await linkGateway.createLink(validLink5)
    expect(createResponse5.success).toBeTruthy()
    const getLinkByAnchorIdResp = await linkGateway.getLinksByAnchorIds([
      'anchor1',
      'anchor2',
    ])
    expect(getLinkByAnchorIdResp.success).toBeTruthy()
    expect(getLinkByAnchorIdResp.payload.length).toBe(4)
    const link1 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link1')
    expect(isSameLink(link1, validLink1)).toBeTruthy()
    const link2 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link2')
    expect(isSameLink(link2, validLink2)).toBeTruthy()
    const link3 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link3')
    expect(isSameLink(link3, validLink3)).toBeTruthy()
    const link4 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link4')
    expect(isSameLink(link4, validLink4)).toBeTruthy()
  })

  test('gets links when given some valid anchorIds', async () => {
    const validLink1: ILink = makeILink('link1', 'anchor1', 'anchor2')
    const createResponse1 = await linkGateway.createLink(validLink1)
    expect(createResponse1.success).toBeTruthy()
    const validLink2: ILink = makeILink('link2', 'anchor2', 'anchor1')
    const createResponse2 = await linkGateway.createLink(validLink2)
    expect(createResponse2.success).toBeTruthy()
    const validLink3: ILink = makeILink('link3', 'anchor3', 'anchor2')
    const createResponse3 = await linkGateway.createLink(validLink3)
    expect(createResponse3.success).toBeTruthy()
    const validLink4: ILink = makeILink('link4', 'anchor3', 'anchor1')
    const createResponse4 = await linkGateway.createLink(validLink4)
    expect(createResponse4.success).toBeTruthy()
    const validLink5: ILink = makeILink('link5', 'anchor3', 'anchor4')
    const createResponse5 = await linkGateway.createLink(validLink5)
    expect(createResponse5.success).toBeTruthy()
    const getLinkByAnchorIdResp = await linkGateway.getLinksByAnchorIds([
      'anchor2',
      'anchor5',
    ])
    expect(getLinkByAnchorIdResp.success).toBeTruthy()
    expect(getLinkByAnchorIdResp.payload.length).toBe(3)
    const link1 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link1')
    expect(isSameLink(link1, validLink1)).toBeTruthy()
    const link2 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link2')
    expect(isSameLink(link2, validLink2)).toBeTruthy()
    const link3 = getLinkByAnchorIdResp.payload.find((link) => link.linkId === 'link3')
    expect(isSameLink(link3, validLink3)).toBeTruthy()
  })

  test('success with empty payload array when given invalid anchorIds', async () => {
    const validLink: ILink = makeILink('link1', 'anchor1', 'anchor2')
    const createResponse = await linkGateway.createLink(validLink)
    expect(createResponse.success).toBeTruthy()
    const getLinkByIdResp = await linkGateway.getLinksByAnchorIds(['anchor3'])
    expect(getLinkByIdResp.success).toBeTruthy()
    expect(getLinkByIdResp.payload.length).toBe(0)
  })
})
