<script>
    import { setCurrentView } from "../lib/viewsCollector";

    const bClass = ""//"bg-surface-500 dark:bg-surface-900 btn preset-filled-surface-500 p-3 rounded-md";

</script>

<div class="w-full text-center bg-surface-500 dark:bg-surface-900 border-t-3 border-surface-800 dark:border-surface-50">
    <button class="p-3" onclick={() => setCurrentView('home')}>Volver al inicio</button>
    <p class="p-5 pt-0">
        <button class="underline text-tertiary-700 dark:text-tertiary-300">
            Aviso legal
        </button>
         | 
        <button class="underline text-tertiary-700 dark:text-tertiary-300">
            Política de privacidad
        </button>
         | 
        <button class="underline text-tertiary-700 dark:text-tertiary-300">
            Política de cookies
        </button>
    </p>
</div>