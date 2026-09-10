import type { HubSpotContact } from "@/lib/hubspot-contacts";

type UsersScreenProps = {
  contacts: HubSpotContact[];
  error?: string | null;
};

export function UsersScreen({ contacts, error }: UsersScreenProps) {
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (contacts.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        HubSpot is connected. No contacts were found.
      </p>
    );
  }

  return (
    <section>
      <h1 className="text-xl font-semibold">HubSpot contacts</h1>
      <ul className="mt-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {contacts.map((contact) => {
          const name = [
            contact.properties.firstname,
            contact.properties.lastname,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={contact.id} className="px-4 py-3">
              <p className="font-medium">{name || "Unnamed contact"}</p>
              <p className="text-sm text-zinc-500">
                {contact.properties.email ?? "No email"}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
