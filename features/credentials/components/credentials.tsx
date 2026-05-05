"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from '@/components/entity-components'
import { Credential, CredentialType } from '@/generated/prisma/client'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { formatDistanceToNow } from 'date-fns'
import { WorkflowIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { useRemoveCredential, useSuspenseCredentials } from '../hooks/use-creadentials'
import { useCredentialsParams } from '../hooks/use-credentials-params'
import Image from 'next/image'

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams()
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    })
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search credentials..."

        />
    )
}

export const CredentialsPagination = () => {
    const [params, setParams] = useCredentialsParams()
    const credentials = useSuspenseCredentials()
    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials()

    if (credentials.data.items.length === 0) {
        return <CredentialsEmpty />
    }

    return (
        <EntityList
            items={credentials.data.items}
            getKey={credential => credential.id}
            renderItem={(credential) => (
                <CredentialItem
                    credential={credential}
                />
            )}
            emptyView={<CredentialsEmpty />}
        />
    )
}

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <EntityHeader
            title="Credentials"
            description="Manage your credentials. Create, update, and organize your credentials to securely access various services."
            newButtonLabel="New Credential"
            newButtonHref="/credentials/new"
            disabled={disabled}
        />
    )
}

export const CredentialsContainer = ({ children }: PropsWithChildren) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />
}

export const CredentialsError = () => {
    return <ErrorView message="Failed to load credentials." />
}

export const CredentialsEmpty = () => {
    const router = useRouter()

    const handleCreateCredential = () => {
        router.push(`/credentials/new`)
    }

    return (
        <EmptyView
            message="No credentials found. Create your first credential to get started."
            onNew={handleCreateCredential}
        />
    )
}

const crendentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.GEMINI]: "/gemini.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
}

export const CredentialItem = ({ credential }: { credential: Credential }) => {
    const removeCredential = useRemoveCredential()

    const handleRemoveCredential = () => {
        removeCredential.mutate({ id: credential.id })
    }

    const logo = crendentialLogos[credential.type] || "/openai.svg"

    return (
        <EntityItem
            href={`/credentials/${credential.id}`}
            title={credential.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(new Date(credential.updatedAt), { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(new Date(credential.createdAt), { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <Image src={logo} alt={credential.name} width={20} height={20} />
                </div>
            }
            onRemove={handleRemoveCredential}
            isRemoving={removeCredential.isPending}
        />
    )
}