"use client";

import { useCallback, useEffect, useState } from "react";

type VendorApplication = {
  id: string;
  applicant_name: string;
  business_name: string;
  email: string;
  phone: string;
  city: string;
  business_type: string;
  business_description: string;
  website: string | null;
  status:
    | "Pending"
    | "Under Review"
    | "Approved"
    | "Rejected"
    | "Suspended";
  is_active: boolean;
  created_at: string;
  management_notes?: string | null;
};

type ApiResponse = {
  applications?: VendorApplication[];
  error?: string;
  message?: string;
};

const statusOptions = [
  "All",
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
  "Suspended",
] as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Under Review":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Approved":
      return "bg-green-50 text-green-700 border-green-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "Suspended":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function ManagementVendorApplicationsPage() {
  const [applications, setApplications] = useState<
    VendorApplication[]
  >([]);

  const [selected, setSelected] =
    useState<VendorApplication | null>(null);

  const [filter, setFilter] =
    useState<(typeof statusOptions)[number]>("All");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function handleVendorAction(
    action: "review" | "activate" | "suspend",
    status?: "Under Review" | "Approved" | "Rejected"
  ) {
    if (!selected || actionLoading) return;

    let managementNotes = selected.management_notes ?? "";

    if (action === "review") {
      const actionLabel =
        status === "Approved"
          ? "approve"
          : status === "Rejected"
            ? "reject"
            : "move to Under Review";

      if (
        !window.confirm(
          `Are you sure you want to ${actionLabel} ${selected.business_name}?`
        )
      ) {
        return;
      }

      const enteredNotes = window.prompt(
        "Management notes (optional):",
        managementNotes
      );
      if (enteredNotes === null) return;
      managementNotes = enteredNotes;
    }

    if (action === "activate") {
      if (
        !window.confirm(
          `Activate ${selected.business_name}? Confirm that the application has been reviewed and approved.`
        )
      ) {
        return;
      }
    }

    if (action === "suspend") {
      const reason = window.prompt(
        "Enter the reason for suspending this vendor:"
      );
      if (reason === null) return;
      if (!reason.trim()) {
        setError("A suspension reason is required.");
        return;
      }
      if (
        !window.confirm(
          `Suspend ${selected.business_name} and deactivate this vendor?`
        )
      ) {
        return;
      }
      managementNotes = reason.trim();
    }

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const body =
        action === "review"
          ? { action, status, managementNotes }
          : action === "suspend"
            ? { action, managementNotes }
            : { action };

      const response = await fetch(
        `/api/management/marketplace/vendors/${encodeURIComponent(selected.id)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Request failed (${response.status}).`
        );
      }

      setNotice(result.message || "Vendor application updated successfully.");
      setSelected(null);
      await loadApplications();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the vendor application."
      );
    } finally {
      setActionLoading(false);
    }
  }

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/management/marketplace/vendors",
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Unable to load applications (${response.status}).`
        );
      }

      if (!Array.isArray(result.applications)) {
        throw new Error(
          "The API response is missing the applications list."
        );
      }

      setApplications(result.applications);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      filter === "All" || application.status === filter;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      [
        application.applicant_name,
        application.business_name,
        application.email,
        application.phone,
        application.city,
        application.id,
      ].some((value) =>
        (value ?? "").toLowerCase().includes(searchText)
      );

    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(
    (item) => item.status === "Pending"
  ).length;

  const reviewCount = applications.filter(
    (item) => item.status === "Under Review"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "Approved"
  ).length;

  const activeCount = applications.filter(
    (item) => item.is_active
  ).length;

  return (
    <main className="min-h-screen bg-[#fffaf8] text-[#302723]">
      <header className="border-b border-[#f0ded7] bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#d9574b]">
              UMEED MARKETPLACE
            </p>

            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              Vendor Applications
            </h1>

            <p className="mt-1 text-sm text-[#84746d]">
              Review applications and monitor vendor activation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadApplications()}
            disabled={loading}
            className="rounded-xl border border-[#edcfc5] bg-white px-5 py-3 text-sm font-bold text-[#c94d42] transition hover:bg-[#fff3ee] disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Applications"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <h2 className="font-bold text-red-800">
              Applications could not be loaded
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-red-700">
              {error}
            </p>

            <p className="mt-2 text-sm leading-6 text-red-700">
              The management API must authenticate the management
              user and check their permissions before returning
              vendor records.
            </p>

            <button
              type="button"
              onClick={() => void loadApplications()}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Applications",
              value: applications.length,
              icon: "▤",
            },
            {
              label: "Pending Review",
              value: pendingCount,
              icon: "◷",
            },
            {
              label: "Under Review",
              value: reviewCount,
              icon: "◎",
            },
            {
              label: "Approved / Active",
              value: `${approvedCount} / ${activeCount}`,
              icon: "✓",
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-2xl border border-[#f0dfd9] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#86756e]">
                  {card.label}
                </p>

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e9] text-lg font-bold text-[#d9574b]">
                  {card.icon}
                </span>
              </div>

              <p className="mt-4 text-3xl font-extrabold">
                {loading ? "—" : card.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#f0dfd9] bg-white shadow-sm">
          <div className="border-b border-[#f1e5e0] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-extrabold">
                  All Applications
                </h2>

                <p className="mt-1 text-sm text-[#8a7972]">
                  Search and filter submitted vendor applications.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, business, email..."
                  aria-label="Search vendor applications"
                  className="min-w-0 rounded-xl border border-[#e9d8d1] px-4 py-3 text-sm outline-none focus:border-[#d9574b] focus:ring-4 focus:ring-[#d9574b]/10 sm:w-72"
                />

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target.value as (typeof statusOptions)[number]
                    )
                  }
                  aria-label="Filter by application status"
                  className="rounded-xl border border-[#e9d8d1] bg-white px-4 py-3 text-sm outline-none focus:border-[#d9574b]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All"
                        ? "All Statuses"
                        : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#f4d9d0] border-t-[#d9574b]" />

              <p className="mt-4 text-sm text-[#8a7972]">
                Loading applications...
              </p>
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-[#8a7972]">
              Fix the API or access issue to view applications.
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e9] text-2xl text-[#d9574b]">
                ▤
              </div>

              <h3 className="mt-4 font-bold">
                No applications found
              </h3>

              <p className="mt-2 text-sm text-[#8a7972]">
                No records match your current search or status
                filter. No sample applications have been added.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-[#fffaf8] text-xs uppercase tracking-wider text-[#8a7972]">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Applicant / Business
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Contact
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Category / City
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Submitted
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Activation
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f2e8e3]">
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="transition hover:bg-[#fffaf8]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold">
                            {application.applicant_name}
                          </p>

                          <p className="mt-1 text-[#8a7972]">
                            {application.business_name}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p>{application.email}</p>
                          <p className="mt-1 text-[#8a7972]">
                            {application.phone}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p>{application.business_type}</p>
                          <p className="mt-1 text-[#8a7972]">
                            {application.city}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-[#756660]">
                          {formatDate(application.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(application.status)}`}
                          >
                            {application.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              application.is_active
                                ? "font-semibold text-green-700"
                                : "font-semibold text-[#9b6c35]"
                            }
                          >
                            {application.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelected(application)}
                            className="rounded-lg border border-[#edcfc5] px-3 py-2 font-semibold text-[#c94d42] transition hover:bg-[#fff0e9]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#f1e5e0] px-5 py-4 text-sm text-[#8a7972]">
                Showing {filteredApplications.length} of{" "}
                {applications.length} applications
              </div>
            </>
          )}
        </section>

        <div className="mt-5 rounded-2xl border border-[#f0dfd9] bg-white p-5">
          <h3 className="font-bold">Important workflow rule</h3>

          <p className="mt-2 text-sm leading-6 text-[#786b66]">
            Approval and activation are separate actions. An
            approved vendor must remain inactive until an authorized
            management user explicitly activates the account.
          </p>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="vendor-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-[#f0dfd9] bg-white p-5">
              <h2
                id="vendor-detail-title"
                className="text-xl font-extrabold"
              >
                Application Details
              </h2>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close application details"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e9] text-xl text-[#c94d42] hover:bg-[#ffe2d8]"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="rounded-xl bg-[#fff8f5] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8075]">
                  Application ID
                </p>

                <p className="mt-2 break-all font-mono text-sm">
                  {selected.id}
                </p>
              </div>

              {[
                ["Applicant Name", selected.applicant_name],
                ["Business Name", selected.business_name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["City", selected.city],
                ["Business Category", selected.business_type],
                [
                  "Submitted At",
                  formatDate(selected.created_at),
                ],
                [
                  "Current Status",
                  selected.status,
                ],
                [
                  "Account Activation",
                  selected.is_active ? "Active" : "Inactive",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 border-b border-[#f3eae6] pb-4 sm:grid-cols-[180px_1fr]"
                >
                  <p className="text-sm text-[#8a7972]">
                    {label}
                  </p>

                  <p className="break-words text-sm font-semibold">
                    {value}
                  </p>
                </div>
              ))}

              <div>
                <p className="text-sm text-[#8a7972]">
                  Business Description
                </p>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">
                  {selected.business_description}
                </p>
              </div>

              {selected.website && (
                <div>
                  <p className="text-sm text-[#8a7972]">
                    Business Website
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-[#c94d42]">
                    {selected.website}
                  </p>
                </div>
              )}

              {selected.management_notes && (
                <div className="rounded-xl border border-[#f0dfd9] bg-[#fffaf8] p-4">
                  <h3 className="font-bold">Management Notes</h3>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                    {selected.management_notes}
                  </p>
                </div>
              )}

              <div className="space-y-3 border-t border-[#f0dfd9] pt-5">
                <h3 className="font-bold">Application Actions</h3>

                {selected.status !== "Suspended" && !selected.is_active && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void handleVendorAction("review", "Under Review")
                      }
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Move to Under Review
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void handleVendorAction("review", "Approved")
                      }
                      className="rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve Application
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void handleVendorAction("review", "Rejected")
                      }
                      className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject Application
                    </button>
                  </div>
                )}

                {selected.status === "Approved" && !selected.is_active && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void handleVendorAction("activate")}
                    className="w-full rounded-xl bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Activate Approved Vendor
                  </button>
                )}

                {selected.status !== "Suspended" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void handleVendorAction("suspend")}
                    className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Suspend Vendor
                  </button>
                )}

                {actionLoading && (
                  <p role="status" className="text-sm text-[#8a7972]">
                    Processing management action...
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-xl bg-[#df584c] px-5 py-3 font-bold text-white transition hover:bg-[#c94a40]"
              >
                Close Details
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}