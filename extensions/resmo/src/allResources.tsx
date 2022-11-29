import { ActionPanel, Action, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import { getPreferenceValues } from "@raycast/api";
import { integrationIconURL, MetaType } from "./query";

interface ResourceRow extends MetaType {
  name: string;
  referencedType: string;
}
interface Resources {
  rows: ResourceRow[];
  fields: {
    name: string;
    type: string;
    isImportant: boolean;
  }[];
}

interface MetadataIntegration {
  description: string;
  name: string;
}
interface Metadata {
  integrations: Record<string, MetadataIntegration>;
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<string>("");
  const tmpDomain = `${getPreferenceValues().resmoDomain}`;
  const resmoDomain = tmpDomain.endsWith("/") ? tmpDomain : tmpDomain + "/";
  const resmoApiKey = `${getPreferenceValues().resmoApiKey}`;

  const { data, isLoading } = useFetch<Resources>(resmoDomain + "api/explore/all/resources", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + resmoApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      freeText: searchText,
      integrations: selectedIntegration ? [selectedIntegration] : [],
      riskScores: [],
      resourceTypes: [],
      fields: [],
    }),
  });
  const { data: metadata } = useFetch<Metadata>(resmoDomain + "api/metadata", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + resmoApiKey,
      "Content-Type": "application/json",
    },
  });

  const integrations = metadata?.integrations;
  const integrationsList = Object.values(metadata?.integrations || {}).sort((int1, int2) =>
    int1.description.localeCompare(int2.description)
  );

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search within your resources..."
      throttle
      searchBarAccessory={
        metadata ? (
          <List.Dropdown
            tooltip="Select Integration"
            value={selectedIntegration ? integrations?.[selectedIntegration].description : "Select Integration"}
            onChange={setSelectedIntegration}
          >
            <List.Dropdown.Item title="All Integrations" value="" />
            {integrationsList.map((integration) => (
              <List.Dropdown.Item
                key={integration.name}
                title={integration.description}
                value={integration.name}
                icon={integrationIconURL(integration.name)}
              />
            ))}
          </List.Dropdown>
        ) : null
      }
    >
      <List.Section title="Results" subtitle={String(data?.rows?.length)}>
        {data?.rows?.map((row, index) => (
          <ResourcesListItem
            key={row.name + "-" + row.referencedType + "-" + index}
            resource={row}
            resmoDomain={resmoDomain}
          />
        ))}
      </List.Section>
    </List>
  );
}

function ResourcesListItem({ resource, resmoDomain }: { resource: ResourceRow; resmoDomain: string }) {
  return (
    <List.Item
      title={resource.name}
      subtitle={resource.referencedType}
      icon={integrationIconURL(resource._meta.integration.type)}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser
              title="Open in Browser"
              url={resmoDomain + "explore/resources/" + resource._meta.type + "/" + resource._meta.recordId}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
